import { SingleEditor } from "../editors/single-editor";
import { Heading, Section } from "./components";

export const Flowers = () => {
    return <>
        <Heading
            title="Flowers"
            subtitle="We will make an automated plant watering system for all flowers in your house.
                Each device (a.k.a. plant) will have a moisture sensor, light sensor and a motor to water your plant." />

        <Section
            step="flower.shared"
            title="1. Shared Configuration">
            We will start by making a file in .lib folder called demo-flower-template.eta. Click on "..." menu in .lib folder and select "New file".

            <div
                style={{ height: "350px" }}>
                <p>.lib/demo-flower-template.eta</p>
                <SingleEditor
                    language="yaml"
                    value="hello" />
            </div></Section>
        <Section
            step="flower.flower-1"
            title="2. Flower Device">

            Now create a new device called flower-1.
            Use a "Create device" button in devices panel. This will automatically create a file "configuration.yaml" for you. ¨
            Rename it to configuration.eta and edit with following content.
            <div
                style={{ height: "250px" }}>
                <p>flower-1/configuration.eta</p>
                <SingleEditor
                    language="yaml"
                    value="hello" />
            </div>
        </Section>

        <Section
            step="flower.flower-2"
            title="3. Additional Devices">
            Repeat step 2. to create an automated watering system for every flower in your home.
            Just change the name in configuration.eta file.

            And that is it. Now you can open your ESPHome dashbpard and flash your configuration to a physical hardware.
        </Section>
    </>;
}