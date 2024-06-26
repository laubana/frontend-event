import * as Yup from "yup";
import { Formik } from "formik";
import { MapRef } from "react-map-gl";
import { FaRegCreditCard } from "react-icons/fa6";
import InputText from "../../../component/InputText";
import { CreateProps } from "./Create.props";
import { useRef } from "react";
import Map from "../../../component/Map";
import { Container, MapContainer } from "./Create.style";
import InputSingleImage from "../../../component/InputSingleImage";
import InputPlace from "../../../component/InputPlace";
import InputTextArea from "../../../component/InputTextArea";
import Text from "../../../component/Text";
import Grid from "../../../component/Grid";
import AutoComplete from "../../../component/AutoComplete";
import Button from "../../../component/Button";

import "mapbox-gl/dist/mapbox-gl.css";
import Loading from "../../../component/Loading";

const Create = (props: CreateProps) => {
  const { categorys, handleGoBack, handleSubmit, initialValues, isVisible } =
    props;

  const mapRef = useRef<MapRef>(null);

  const validationSchema = Yup.object().shape({
    category: Yup.object().required("Category is required"),
    image: Yup.object().required("Image is required"),
    thumbnail: Yup.object().required("Thumbnail is required"),
    name: Yup.string().required("Name is required"),
    place: Yup.object().required("Place is required"),
    address: Yup.string().required("Address is required"),
    latitude: Yup.string().required("Latitude is required"),
    longitude: Yup.string().required("Longitude is required"),
    description: Yup.string().required("Description is required"),
  });

  return (
    <>
      {categorys ? (
        <Container>
          <Text sizing="large">Create Event</Text>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit, values, setFieldValue, touched, errors }) => (
              <Grid style={{ gap: "32px" }}>
                <Grid>
                  <AutoComplete
                    label="Category"
                    placeholder="Category"
                    option={values.category}
                    options={categorys.map((category, index) => ({
                      value: category._id,
                      label: category.value,
                    }))}
                    setOption={(option) => {
                      setFieldValue("category", option);
                    }}
                    error={touched.category ? errors.category : ""}
                  />
                  <InputSingleImage
                    label="Thumbnail"
                    image={values.thumbnail}
                    setImage={(image) => {
                      setFieldValue("thumbnail", image);
                    }}
                    error={touched.thumbnail ? errors.thumbnail : ""}
                  />
                  <InputSingleImage
                    label="Image"
                    image={values.image}
                    setImage={(image) => {
                      setFieldValue("image", image);
                    }}
                    error={touched.image ? errors.image : ""}
                    style={{ aspectRatio: 2 }}
                  />
                  <InputText
                    label="Name"
                    placeholder="Name"
                    text={values.name}
                    setText={(text) => setFieldValue("name", text)}
                    error={touched.name ? errors.name : ""}
                  />
                  <InputPlace
                    label="Address"
                    placeholder="Address"
                    setPlace={(place) => {
                      setFieldValue("place", place);
                      setFieldValue("address", place.address);
                      setFieldValue("latitude", place.latitude.toString());
                      setFieldValue("longitude", place.longitude.toString());

                      mapRef.current?.flyTo({
                        center: [place.longitude, place.latitude],
                        duration: 500,
                      });
                    }}
                    error={touched.address ? errors.address : ""}
                  />
                  <MapContainer>
                    <Map
                      forwardedRef={mapRef}
                      markers={
                        values.place && [
                          {
                            latitude: values.place.latitude,
                            longitude: values.place.longitude,
                          },
                        ]
                      }
                    />
                  </MapContainer>
                  <InputTextArea
                    label="Description"
                    placeholder="Description"
                    text={values.description}
                    setText={(text) => setFieldValue("description", text)}
                    error={touched.description ? errors.description : ""}
                  />
                </Grid>
                <Button onClick={handleSubmit} block>
                  <FaRegCreditCard size={16} />
                  Create
                </Button>
              </Grid>
            )}
          </Formik>
          <Button coloring="black" onClick={handleGoBack} block>
            Go Back
          </Button>
        </Container>
      ) : (
        <Loading />
      )}
      <Loading isVisibile={isVisible} />
    </>
  );
};

export default Create;
