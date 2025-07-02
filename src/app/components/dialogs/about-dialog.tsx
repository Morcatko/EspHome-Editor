import { useStatusStore } from '@/app/stores/status-store';
import { modals } from '@mantine/modals';
import { KoFiButton } from "react-kofi";
import { ExtLink } from '../ext-link';

const AboutDialogContent = () => {
    const statusStore = useStatusStore();
    return <div className='mb-3'>
        <div className="flex flex-col">
            <span>Version: {statusStore.query.isSuccess && <ExtLink href="https://github.com/Morcatko/EspHome-Editor/releases">{statusStore.query.data?.version}</ExtLink>}</span>
            <span><ExtLink href="https://editor-4-esphome.github.io/">Documentation</ExtLink></span>
            <span>{statusStore.query.isSuccess && <ExtLink href={statusStore.query.data?.espHomeWebUrl}>ESPHome</ExtLink>}</span>
        </div>
        <h3>Support Future Development </h3>
        <div>
            <div>Spread the word</div>
            <ul>
                <li>Star <ExtLink href="https://github.com/Morcatko/EspHome-Editor">GitHub Repository</ExtLink></li>
                <li>Post on <ExtLink href="https://www.reddit.com/r/Esphome/submit">r/Esphome</ExtLink> or <ExtLink href="https://www.reddit.com/r/homeassistant/submit">r/homeassistant</ExtLink> reddit</li>
            </ul>
        </div>
        <div>
            <div>Provide feedback</div>
            <ul>
                <li>Tell us what you like and what you don't in <ExtLink href="https://github.com/Morcatko/EspHome-Editor/issues">GitHub Issue</ExtLink></li>
            </ul>
        </div>
        <div>
            <div>Financial Support</div>
            <ul>
                <li>Need ESP32s? Use our <ExtLink href="https://s.click.aliexpress.com/e/_oCI3XiY">AliExpress affiliate link</ExtLink> and toss us a little love!</li>
            </ul>
            <div className='ml-4'>
                <KoFiButton
                    id="morcatko"
                    label="Support me"
                />
            </div>
        </div>
    </div>;
}
export const openAboutDialog = () =>
    modals.open({
        title: <h1>Editor for ESPHome</h1>,
        children: <AboutDialogContent />,
        size: 'lg',
    })