import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ImageType } from "react-images-uploading";
import InputSingleImage from "../../component/InputSingleImage";

import "../../../src/index.css";

const Component = () => {
  const [image, setImage] = useState<ImageType | undefined>(undefined);

  return (
    <div style={{ width: "30%" }}>
      <InputSingleImage image={image} setImage={setImage} />
    </div>
  );
};

const meta: Meta<typeof InputSingleImage> = {
  title: "Component/InputSingleImage",
  component: Component,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
