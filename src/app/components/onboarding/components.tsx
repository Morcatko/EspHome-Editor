import { useLocalStorage } from "usehooks-ts";
import { SingleEditor } from "../editors/single-editor";

export const Heading = ({ title, subtitle }: { title: string, subtitle: string }) =>
    <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
            {subtitle}
        </p>
    </div>;


type TSectionProps = {
    step: string;
    title: string;
    children: React.ReactNode;
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

export const Code = (p: { fileName: string, heightPx: number, code: string }) => <>
    <p>{p.fileName}</p>
    <div
        style={{ height: `${p.heightPx}px` }}>
        <SingleEditor
            language="yaml"
            value={p.code} />
    </div>
</>