import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Geocode from "react-geocode";
import { Place } from "../../type/Place";
import InputPlace from "../../component/InputPlace";
import Text from "../../component/Text";

import "../../../src/index.css";

const Component = () => {
  const [currentAddress, setCurrentAddress] =
    useState<string>("Langara College");
  const [place, setPlace] = useState<Place | undefined>(undefined);

  return (
    <div style={{ display: "flex", gap: "16px" }}>
      <div style={{ display: "grid", gap: "16px" }}>
        <InputPlace
          label="Place"
          placeholder="Address"
          address={currentAddress}
          setPlace={setPlace}
          sizing="small"
        />
        <InputPlace
          label="Place"
          address={currentAddress}
          setPlace={setPlace}
          sizing="small"
        />
        <Text>{place?.address}</Text>
      </div>
      <div style={{ display: "grid", gap: "16px" }}>
        <InputPlace
          label="Place"
          placeholder="Address"
          address={currentAddress}
          setPlace={setPlace}
        />
        <InputPlace
          label="Place"
          address={currentAddress}
          setPlace={setPlace}
        />
        <Text>{place?.address}</Text>
      </div>
      <div style={{ display: "grid", gap: "16px" }}>
        <InputPlace
          label="Place"
          placeholder="Address"
          address={currentAddress}
          setPlace={setPlace}
          sizing="large"
        />
        <InputPlace
          label="Place"
          address={currentAddress}
          setPlace={setPlace}
          sizing="large"
        />
        <Text>{place?.address}</Text>
      </div>
    </div>
  );
};

const meta: Meta<typeof InputPlace> = {
  title: "Component/InputPlace",
  component: Component,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
