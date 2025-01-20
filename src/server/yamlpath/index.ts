import * as YAML from "yaml";

// @ts-ignore  
import { parse as jp_parse } from "jsonpathly";
import {
    BracketExpressionContent,
    DotContent,
    FilterExpressionContent,
    Root,
    Subscript,
// @ts-ignore  
} from "jsonpathly/parser/types";


//import { log as logger } from "@/shared/log";
const log = (...args: any[]) => {}/*logger.create({defaults: {
    level: 950,
    //type: "verbose",
}
}).log;*/

const _applyDot = (nodes: YAML.Node[], path: DotContent): YAML.Node[] => {
    log("_applyDot: ", path);
    switch (path.type) {
        case "identifier":
            return nodes
                .flatMap((n) => {
                    if (n instanceof YAML.YAMLMap) {
                        return [n.get(path.value) as YAML.Node];
                    } else if ( n instanceof YAML.YAMLSeq) {
                        return _applyDot(n.items as YAML.Node[], path);
                    }
                    else {
                        throw new Error("Unsupported node type: ", n?.toJSON());
                    }
                })
                .filter((n) => n);
        default:
            throw new Error("Unsupported dot content type: " + path.type);
    }
};

const _applyFilterExpression = (nodes: YAML.Node[], path: FilterExpressionContent) => {
    log("_applyFilterExpression: ", path);
    switch (path.type) {
        case "comparator":
            if (path.left.type !== "current") {
                throw new Error("Unsupported left type: " + path.left.type);
            }
            if (path.right?.type !== "value") {
                throw new Error("Unsupported right type: " + path.right?.type);
            }
          
            if (path.left.next?.type !== "subscript") {
                throw new Error("Unsupported left next type: " + path.left.next?.type);
            }

            const leftOperand = path.left.next;
            const rightValue = path.right.value;


            if (nodes.length > 1) 
                throw new Error("Multiple nodes not supported in filter expression");

            const _nodesToFilter = 
                (nodes[0] instanceof YAML.YAMLMap)
                ? nodes
                : (nodes[0] as YAML.YAMLSeq).items as YAML.Node[];

            return _nodesToFilter.filter((n) => {
                const res = _applySubscript([n], leftOperand);
                
                if (res.length === 0)
                    return false;
                else if (res.length === 1)
                    return res[0] === rightValue;
                else 
                    throw new Error("Multiple results in filter expression");

            });
        default:
            throw new Error("Unsupported filter expression type: " + path.type);
    }
};

const _applyBracketExpression = (
    nodes: YAML.Node[],
    path: BracketExpressionContent,
) => {
    log("_applyBracketExpression: ", path);
    switch (path.type) {
        case "filterExpression":
            return _applyFilterExpression(nodes, path.value);
        default:
            throw new Error(
                "Unsupported bracket expression content type: " + path.type,
            );
    }
};

const _applySubscript = (nodes: YAML.Node[], path: Subscript): YAML.Node[] => {
    log("_applySubscript: ", path);
    let result: YAML.Node[] = [];

    switch (path.value.type) {
        case "dot":
            result = _applyDot(nodes, path.value.value);
            break;
        case "bracketExpression":
            result = _applyBracketExpression(nodes, path.value.value);
            break;

        default:
            throw new Error("Unsupported subscript type: " + path.value.type);
    }

    return (path.next) ? _applySubscript(result, path.next) : result;
};

const apply = (yaml: YAML.Document, root: Root | null) => {
    if ((root?.type === "root") && yaml.contents) {
        if (root.next) {
            return _applySubscript([yaml.contents], root.next);
        }
    } 
    throw new Error("Unsupported root type: " + root?.type);
};

export const parse = (yamlDocument: YAML.Document, path: string ) => {
    log("Path: ", path);
    const jp_path = jp_parse(path);
    return apply(yamlDocument, jp_path);
};
