import { useLocalStorage } from "usehooks-ts";
import { SingleEditor } from "../editors/single-editor";

type TChildren = {
    children: React.ReactNode
}

export const Ol = (p: TChildren) => <ol className="list-decimal ml-8 mt-3 space-y-2">{p.children}</ol>;
export const Ul = (p: TChildren) => <ul className="list-disc ml-8 mt-3 space-y-2">{p.children}</ul>;
export const Code = (p: TChildren) => <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-blue-700 dark:text-blue-300 font-mono">{p.children}</code>;

export const Heading = ({ title, subtitle }: { title: string, subtitle: string }) =>
    <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
            {subtitle}
        </p>
    </div>;


type TSectionProps = TChildren & {
    step: string;
    title: string;
};

export const Section = ({ step, title, children }: TSectionProps) => {
    const [hidden, setHidden] = useLocalStorage(`e4e.onboarding.${step}`, false);

    return <>
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex justify-between items-center">
                <a href="#" onClick={() => setHidden(!hidden)}>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200" >
                        {title}
                    </h2>
                </a>
                <label>
                    <input
                        type="checkbox"
                        checked={hidden}
                        className="mr-2 accent-gray-200 dark:accent-gray-600 scale-150"
                        onChange={() => setHidden(!hidden)}
                    />
                </label>
            </div>
            {!hidden && <div className="text-gray-700 dark:text-gray-300 mt-2">
                {children}
            </div>}
        </div>
    </>;
}

export const Editor = (p: { heightPx: number, code: string }) =>
    <div className="my-2">
        <div
            style={{ height: `${p.heightPx}px` }}>
            <SingleEditor
                language="yaml"
                value={p.code} />
        </div>
    </div>