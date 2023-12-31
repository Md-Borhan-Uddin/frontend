import React, { useEffect, useRef, useState } from "react";
import DeleteButton from "../../../components/deleteButton";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Select,
  Spacer,
  useDisclosure,
  useToast,
  Checkbox,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Textarea,
  RadioGroup,
  Stack,
  Radio,
  CheckboxGroup,
  Switch,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { packageSchima } from "../../../Schima";
import axios from "axios";
import { baseUrl } from "../../../utility/baseURL";
import { getUser } from "../../../utility/authentication";
import { useNavigate } from "react-router-dom";
import { months } from "../../../utility/utlity";
import RequireAuth from "../../../components/auth/TokenExpaireCheck";

const inputdata = {
  name: "",
  description: "",
  duration_date: "",
  duration_month: "",
  is_free: false,
  is_active: false,
  pricing_approach: "",
  default_price: "",
  default_real_estate_number: "",
  is_renewal: false,
  enabling_adding_extra_real_estate: 'true',
  price_per_real_estate: "",
  feature: [],
};

function Package() {
  const [isEdit, setIsEdit] = useState(false);
  const [packages, setPackages] = useState([]);
  const [id, setId] = useState();
  const router = useNavigate();
  const toast = useToast();
  const [customerror, setcustomerror] = useState({});

  const { isOpen, onClose, onOpen } = useDisclosure();
  const { access_token } = getUser();

  const headers = {
    Authorization: "Bearer " + String(access_token), //the token is a variable which holds the token
  };
  const getPackage = async (id = null) => {
    let url = baseUrl.defaults.baseURL + "/package/";
    if (id) {
      url = baseUrl.defaults.baseURL + `/package/${id}/`;
    }
    const res = await fetch(url, { headers: headers })
      .then((res) => res.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log(error);
      });

    return res;
  };

  useEffect(() => {
    axios
      .get(baseUrl.defaults.baseURL + "/package/", { headers: headers })
      .then((res) => {
        setPackages(res.data);
      })
      .catch((error) => {
        console.log(error);
      });

    // getPackage().then(res=>console.log("data",res))
  }, []);

  const {
    values,
    errors,
    setValues,
    handleChange,
    handleSubmit,
    handleReset,
    touched,
    setFieldValue,
    handleBlur
  } = useFormik({
    initialValues: inputdata,
    validationSchema: packageSchima,
    onSubmit: (values, { setSubmitting }) => {
      axios
        .post(baseUrl.defaults.baseURL + "/package/", values, {
          headers: headers,
        })
        .then((res) => {
          console.log(res);
          getPackage().then((res) => setPackages(res));
          if (res.status == 201) {
            packages.push(res.data);
            toast({
              title: "Package create successfully",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            onClose();
            handleReset();
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data.non_field_errors) {
            error.response.data.non_field_errors.map((message) => {
              toast({
                title: message,
                status: "error",
                duration: 3000,
                isClosable: true,
              });
            });
          }
          if (error.response.status == 401) {
            toast({
              title: "You are not Login Login First",
              status: "error",
              duration: 2000,
              isClosable: true,
            });
            router("/login");
          }
        });
    },
  });

  const handleEdit = (e) => {
    setIsEdit(true);
    const { value } = e.target;
    setId(value);
    axios
      .get(baseUrl.defaults.baseURL + `/package/${value}/`, {
        headers: headers,
      })
      .then((res) => {
        console.log(res);
        onOpen();
        setValues({
          name: res.data?.name,
          description: res.data?.description,
          duration_date: res.data?.duration_date,
          duration_month: res.data?.duration_month,
          is_free: res.data.is_free ? "true" : false,
          is_active: res.data.is_active ? "true" : false,
          pricing_approach: res.data?.pricing_approach,
          default_price: res.data?.default_price,
          default_real_estate_number: res.data?.default_real_estate_number,
          is_renewal: res.data.is_renewal ? "true" : false,
          enabling_adding_extra_real_estate: res.data
            .enabling_adding_extra_real_estate
            ? "true"
            : false,
          price_per_real_estate: res.data?.price_per_real_estate,
          feature: res.data?.feature,
        });
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Somethings wrong try again",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        if (error.response.status == 401) {
          toast({
            title: "You are not Login Login First",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
          router("/login");
        }
      });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .patch(baseUrl.defaults.baseURL + `/package/${id}/`, values, {
        headers: headers,
      })
      .then((res) => {
        console.log(res);
        getPackage().then((res) => setPackages(res));
        toast({
          title: "update Successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Somethings wrong try again",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        if (error.response.status == 401) {
          toast({
            title: "You are not Login Login First",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
          router("/login");
        }
      });

    onClose();
    handleReset();
  };

  const handleDelete = (id) => {

    axios
      .delete(baseUrl.defaults.baseURL + `/package/${id}/`, {
        headers: headers,
      })
      .then((res) => {
        console.log(res);
        getPackage().then((res) => setPackages(res));
        toast({
          title: "Delete Successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Somethings wrong try again",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        if (error.response.status == 401) {
          toast({
            title: "You are not Login Login First",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
          router("/login");
        }
      });
  };

  const packageStatus = (e) => {
    const { value, checked } = e.target;
    axios
      .patch(baseUrl.defaults.baseURL + `/package/${value}/`, {is_active:checked}, {
        headers: headers,
      })
      .then((res) => {
        console.log(res);
        getPackage().then((res) => setPackages(res));
        toast({
          title: "update Successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Somethings wrong try again",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        if (error.response.status == 401) {
          toast({
            title: "You are not Login Login First",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
          router("/login");
        }
      });
  };

  return (
    <>
      <Box py={12} px={4}>
        <HStack spacing={2} textAlign="center" mb="1rem">
          <Heading as="h1" fontSize="4xl">
            All Packages
          </Heading>
          <Spacer />
          <Button
            colorScheme="primary"
            onClick={() => {
              handleReset();
              setIsEdit(false);
              onOpen();
            }}
          >
            Add Package
          </Button>
        </HStack>
        <Box>
          <TableContainer>
            <Table variant="simple" textAlign={"center"}>
              <Thead bg={"gray.200"}>
                <Tr>
                  <Th>Name</Th>
                  <Th>Duration(Date/Month)</Th>
                  <Th>Status</Th>
                  <Th>Price</Th>
                  <Th textAlign={"center"}>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {packages.map((item) => {
                  return (
                    <Tr key={item.id}>
                      <Td>{item.name}</Td>
                      <Td>
                        {item.duration_date}/{item.duration_month}
                      </Td>
                      <Td>
                      <Switch
                        value={item.id}
                        onChange={packageStatus}
                        isChecked={item.is_active}
                      />
                      </Td>
                      <Td>{item.default_price}</Td>
                      <Td>
                        <HStack alignItems={"center"} justifyContent={"center"}>
                          <Button
                            aria-label="editbtn"
                            onClick={handleEdit}
                            value={item.id}
                            colorScheme="teal"
                          >
                            Edit
                          </Button>
                          <DeleteButton handleDelete={handleDelete} id={item.id} />
                        </HStack>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* Package Add modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW={"70%"}>
          <ModalHeader>Add Package</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                  <FormControl isInvalid={errors.name && touched.name}>
                    <FormLabel
                      color="secondary.600"
                      fontWeight="semibold"
                      fontSize="0.9rem"
                    >
                      Package Name
                    </FormLabel>
                    <Input
                      type="text"
                      placeholder="Package Name"
                      name="name"
                      onChange={handleChange}
                      value={values.name}
                      onBlur={handleBlur}
                    />
                    {errors.name && touched.name ? (
                      <FormErrorMessage>{errors.name}</FormErrorMessage>
                    ) : null}
                  </FormControl>
              </Box>
              <Box mb={2}>
                <FormControl
                  isInvalid={errors.description && touched.description}
                >
                  <FormLabel
                    color="secondary.600"
                    fontWeight="semibold"
                    fontSize="0.9rem"
                  >
                    Package Description
                  </FormLabel>
                  <Textarea
                    placeholder="Package Description"
                    onChange={handleChange}
                    name="description"
                    value={values.description}
                    onBlur={handleBlur}
                  ></Textarea>
                  {errors.description && touched.description ? (
                    <FormErrorMessage>{errors.description}</FormErrorMessage>
                  ) : null}
                </FormControl>
              </Box>

              <Box mb={2}>
                <FormControl isInvalid={errors.feature && touched.feature}>
                  <FormLabel
                    color="secondary.600"
                    fontWeight="semibold"
                    fontSize="0.9rem"
                  >
                    Feature
                  </FormLabel>
                  <CheckboxGroup
                    colorScheme="primary"
                    isNative={true}
                    name="feature"
                    defaultValue={values.feature}
                    onBlur={handleBlur}
                  >
                    <SimpleGrid columns={{ base: 1, md: 2 }}>
                      <Checkbox
                        value="Create Real Estate"
                        isChecked={values.feature.find(
                          (ele) => ele === "Edit Real Estate"
                        )}
                        textColor="secondary.300"
                        onChange={handleChange}
                        name="feature"
                      >
                        Create Real Estate
                      </Checkbox>
                      <Checkbox value="Edit Real Estate"
                        isChecked={values.feature.find(
                          (ele) => ele === "Edit Real Estate"
                        )}
                        textColor="secondary.300"
                        onChange={handleChange}
                        name="feature"
                        onBlur={handleBlur}
                      >
                        Edit Real Estate
                      </Checkbox>
                      <Checkbox
                        value="Create Asset"
                        onChange={handleChange}
                        name="feature"
                        isChecked={values.feature.find(
                          (ele) => ele === "Create Asset"
                        )}
                        onBlur={handleBlur}
                      >
                        Create Asset
                      </Checkbox>
                      <Checkbox
                        value="Edit Asset"
                        onChange={handleChange}
                        name="feature"
                        isChecked={values.feature.find(
                          (ele) => ele === "Edit Asset"
                        )}
                        onBlur={handleBlur}
                      >
                        Edit Asset
                      </Checkbox>
                      <Checkbox
                        value="Maintenance Scheduling"
                        onChange={handleChange}
                        name="feature"
                        isChecked={values.feature.find(
                          (ele) => ele === "Maintenance Scheduling"
                        )}
                        onBlur={handleBlur}
                      >
                        Maintenance Scheduling
                      </Checkbox>
                      <Checkbox
                        value="Calculating the Effectiveness of the Real Estate"
                        onChange={handleChange}
                        name="feature"
                        isChecked={values.feature.find(
                          (ele) => ele === "Calculating the Effectiveness of the Real Estate"
                        )}
                        onBlur={handleBlur}
                      >
                        Calculating the Effectiveness of the Real Estate
                      </Checkbox>
                      <Checkbox
                        value="Calculating the Effectiveness of the Asset"
                        onChange={handleChange}
                        name="feature"
                        isChecked={values.feature.find(
                          (ele) => ele === "Calculating the Effectiveness of the Asset"
                        )}
                        onBlur={handleBlur}
                      >
                        Calculating the Effectiveness of the Asset
                      </Checkbox>
                      <Checkbox
                        value="Reports"
                        onChange={handleChange}
                        name="feature"
                        isChecked={values.feature.find(
                          (ele) => ele === "Reports"
                        )}
                        onBlur={handleBlur}
                      >
                        Reports
                      </Checkbox>
                      <Checkbox
                        value="Dashboard"
                        onChange={handleChange}
                        name="feature"
                        onBlur={handleBlur}
                        isChecked={values.feature.find((item)=>item==='Dashboard')}
                      >
                        Dashboard
                      </Checkbox>
                    </SimpleGrid>
                  </CheckboxGroup>
                  {errors.feature && touched.feature ? (
                    <FormErrorMessage>{errors.feature}</FormErrorMessage>
                  ) : null}
                </FormControl>
              </Box>

              <Box mb={2}>
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={2}>
                  <FormControl
                    isInvalid={errors.duration_date && touched.duration_date}
                  >
                    <FormLabel
                      color="secondary.600"
                      fontWeight="semibold"
                      fontSize="0.9rem"
                    >
                      Duration(Date)
                    </FormLabel>
                    <Select
                      placeholder="Date"
                      name="duration_date"
                      value={values.duration_date}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      {months(31).map((item, i) => (
                        <option key={i} value={item.value}>
                          {item.key}
                        </option>
                      ))}
                    </Select>
                    {errors.duration_date && touched.duration_month ? (
                      <FormErrorMessage>
                        {errors.duration_date}
                      </FormErrorMessage>
                    ) : null}
                  </FormControl>
                  <FormControl
                    isInvalid={errors.duration_month && touched.duration_month}
                  >
                    <FormLabel
                      color="secondary.600"
                      fontWeight="semibold"
                      fontSize="0.9rem"
                    >
                      Duration(Month)
                    </FormLabel>
                    <Select
                      placeholder="Month"
                      name="duration_month"
                      value={values.duration_month}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      {months(12).map((item, i) => (
                        <option key={i} value={item.value}>
                          {item.key}
                        </option>
                      ))}
                    </Select>
                    {errors.duration_month && touched.duration_month ? (
                      <FormErrorMessage>
                        {errors.duration_month}
                      </FormErrorMessage>
                    ) : null}
                  </FormControl>
                </SimpleGrid>
              </Box>

              <Box mb={2}>
                <SimpleGrid columns={{ base: 1, md: 2 }}>
                  <FormControl isInvalid={errors.is_free && touched.is_free}>
                    <FormLabel
                      color="secondary.600"
                      fontWeight="semibold"
                      fontSize="0.9rem"
                    >
                      is This Free Package?
                    </FormLabel>
                    <RadioGroup
                      onChange={(e) => setFieldValue("is_free", e)}
                      value={values.is_free}
                      name="is_free"
                      onBlur={handleBlur}
                    >
                      <Stack spacing={5} direction="row">
                        <Radio value="true" colorScheme="primary">
                          Yes
                        </Radio>
                        <Radio value="false" colorScheme="primary">
                          No
                        </Radio>
                      </Stack>
                    </RadioGroup>
                    {errors.is_free && touched.is_free ? (
                      <FormErrorMessage>{errors.is_free}</FormErrorMessage>
                    ) : null}
                  </FormControl>
                  {values.is_free==='true'&&
                  <Box>
                    <FormControl
                      isInvalid={
                        errors.pricing_approach && touched.pricing_approach
                      }
                    >
                      <FormLabel
                        color="secondary.600"
                        fontWeight="semibold"
                        fontSize="0.9rem"
                      >
                        Pricing Approach
                      </FormLabel>
                      <RadioGroup
                        onChange={(e) => setFieldValue("pricing_approach", e)}
                        value={values.pricing_approach}
                        name="pricing_approach"
                        onBlur={handleBlur}
                      >
                        <Stack spacing={3} direction="column">
                          <Radio
                            colorScheme="primary"
                            value="Based on default real estate"
                            fontSize="0.6rem"
                          >
                            Based on default real estate
                          </Radio>
                          <Radio
                            colorScheme="primary"
                            value="Based on number of real estate only"
                          >
                            Based on number of real estate only
                          </Radio>
                        </Stack>
                      </RadioGroup>
                      {errors.pricing_approach && touched.pricing_approach ? (
                        <FormErrorMessage>
                          {errors.pricing_approach}
                        </FormErrorMessage>
                      ) : null}
                    </FormControl>
                  </Box>
                  }
                </SimpleGrid>
              </Box>

              <Box mb={2}>
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                <FormControl
                    isInvalid={errors.default_price && touched.default_price}
                  >
                    <FormLabel
                      color="secondary.600"
                      fontWeight="semibold"
                      fontSize="0.9rem"
                    >
                      Default Package Price
                    </FormLabel>
                    <Input
                      placeholder="Default Package Price"
                      onChange={handleChange}
                      name="default_price"
                      value={values.default_price}
                      onBlur={handleBlur}
                    />
                    {errors.default_price && touched.default_price ? (
                      <FormErrorMessage>
                        {errors.default_price}
                      </FormErrorMessage>
                    ) : null}
                  </FormControl>
                  <FormControl
                    isInvalid={
                      errors.default_real_estate_number &&
                      touched.default_real_estate_number
                    }
                  >
                    <FormLabel
                      color="secondary.600"
                      fontWeight="semibold"
                      fontSize="0.9rem"
                    >
                      Default Real Estate Number
                    </FormLabel>
                    <Input
                      placeholder="Default Real Estate Number"
                      onChange={handleChange}
                      name="default_real_estate_number"
                      value={values.default_real_estate_number}
                      onBlur={handleBlur}
                    />
                    {errors.default_real_estate_number &&
                    touched.default_real_estate_number ? (
                      <FormErrorMessage>
                        {errors.default_real_estate_number}
                      </FormErrorMessage>
                    ) : null}
                  </FormControl>
                </SimpleGrid>
              </Box>

              <Box mb={2}>
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                <FormControl
                    isInvalid={errors.is_renewal && touched.is_renewal}
                  >
                    <FormLabel
                      color="secondary.600"
                      fontWeight="semibold"
                      fontSize="0.9rem"
                    >
                      is This Enabling Renewal?
                    </FormLabel>
                    <RadioGroup
                      onChange={(e) => setFieldValue("is_renewal", e)}
                      value={values.is_renewal}
                      name="is_renewal"
                      onBlur={handleBlur}
                    >
                      <Stack spacing={5} direction="row">
                        <Radio colorScheme="primary" value="true">
                          Yes
                        </Radio>
                        <Radio colorScheme="primary" value="false">
                          No
                        </Radio>
                      </Stack>
                    </RadioGroup>
                    {errors.is_renewal && touched.is_renewal ? (
                      <FormErrorMessage>{errors.is_renewal}</FormErrorMessage>
                    ) : null}
                  </FormControl>

                  <FormControl
                      isInvalid={
                        errors.enabling_adding_extra_real_estate &&
                        touched.enabling_adding_extra_real_estate
                      }
                    >
                      <FormLabel
                        color="secondary.600"
                        fontWeight="semibold"
                        fontSize="0.9rem"
                      >
                        Enabling Adding Extra Real Estate
                      </FormLabel>
                      <RadioGroup
                        onChange={(e) =>
                          setFieldValue("enabling_adding_extra_real_estate", e)
                        }
                        value={values.enabling_adding_extra_real_estate}
                        name="enabling_adding_extra_real_estate"
                        defaultValue='true'
                        onBlur={handleBlur}
                        isDisabled={values.pricing_approach==='Based on number of real estate only'?true:false}
                      >
                        <Stack spacing={5} direction="row">
                          <Radio value="true" colorScheme="primary">
                            Yes
                          </Radio>
                          <Radio value="false" colorScheme="primary">
                            No
                          </Radio>
                        </Stack>
                      </RadioGroup>
                      {errors.enabling_adding_extra_real_estate &&
                      touched.enabling_adding_extra_real_estate ? (
                        <FormErrorMessage>
                          {errors.enabling_adding_extra_real_estate}
                        </FormErrorMessage>
                      ) : null}
                    </FormControl>
                </SimpleGrid>
              </Box>

              <Box>
              <FormControl
                    isInvalid={
                      errors.price_per_real_estate &&
                      touched.price_per_real_estate
                    }
                  >
                    <FormLabel
                      color="secondary.600"
                      fontWeight="semibold"
                      fontSize="0.9rem"
                    >
                      Price Per Real Estate
                    </FormLabel>
                    <Input
                      placeholder="Price Per Real Estate"
                      onChange={handleChange}
                      name="price_per_real_estate"
                      value={values.price_per_real_estate}
                      onBlur={handleBlur}
                    />
                    {errors.price_per_real_estate &&
                    touched.price_per_real_estate ? (
                      <FormErrorMessage>
                        {errors.price_per_real_estate}
                      </FormErrorMessage>
                    ) : null}
                  </FormControl>
              </Box>

              
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button>
                {isEdit ? (
                  <Button
                    onClick={handleUpdate}
                    variant="outline"
                    colorScheme="primary"
                    transition="ease-in-out 0.5s"
                    _hover={{ bgColor: "primary.600", color: "#fff" }}
                  >
                    Update
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="outline"
                    colorScheme="primary"
                    transition="ease-in-out 0.5s"
                    _hover={{ bgColor: "primary.600", color: "#fff" }}
                  >
                    Save
                  </Button>
                )}
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default RequireAuth(Package);




