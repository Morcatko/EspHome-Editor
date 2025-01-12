import { SingleEditor } from "../editors/single-editor";
import { Heading, Section } from "./components";

export const Flowers = () => {
    return <>
        <Heading
            title="Flwers"
            subtitle="We will make an automated plant watering system for all flowers in your house.
                Each device (a.k.a. plant) will have a moisture sensor, light sensor and a motor to water your plant.
                Additionally each plan will have its own watering schedule." />

        <Section
            step="flower.shared"
            title="Shared configuration">
            We will start by making a file in .lib folder called demo-flower.eta
            <div
                style={{ height: "300px" }}>
                <p>.lib/demo-flower.eta</p>
                <SingleEditor
                    language="yaml"
                    value="hello" />
            </div></Section>
        <Section
            step="flower.flower-1"
            title="Flower device">

            We will create a new device called flower-1 in the demo-flower.eta file.
        </Section>
    </>;
}