import { c } from "@/server/config";
import { Eta } from "eta"


export const processTemplate_eta = (filePath: string, testData: string | null) => {
    const eta = new Eta({ 
        views: c.devicesDir, 
        cache: true, 
        debug: false, 
        rmWhitespace: false, 
        autoEscape: false,
        autoTrim: false })
    
    const output = eta.render(
        filePath,
        JSON.parse(testData || "{}")
        //{ filepath: './devices/plc/index.eta'}
    );
    
    return output;
}

