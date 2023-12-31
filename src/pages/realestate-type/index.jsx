import React, { useEffect, useState } from "react";
import DeleteButton from '../../../components/deleteButton'
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Switch,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import CustomModal from "../../../components/UserEditModal";
import { useFormik } from "formik";
import axios from "axios";
import { baseURL } from "../../../utility/baseURL";
import { getUser } from "../../../utility/authentication";
import { BiEdit } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import {
  getObjects,
} from "../../../utility/category_brand";
import RequireAuth from "../../../components/auth/TokenExpaireCheck";

import { realestateTypeSchima } from "../../../Schima";
// const categorys = [{ name: "bangladesh" }, { name: "india" }];

const inputdata = {
  name: "",
  is_active: false,
};

function RealestateType() {
  const [types, setTypes] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState();
  const router = useNavigate();
  const toast = useToast();
  const [customerror, setcustomerror] = useState({});

  const { isOpen, onClose, onOpen } = useDisclosure();
  const { access_token } = getUser();

  const headers = {
    Authorization: "Bearer " + String(access_token), //the token is a variable which holds the token
  };

  const {
    values,
    errors,
    setValues,
    handleChange,
    handleSubmit,
    handleReset,
    handleBlur,
    touched,
    resetForm
  } = useFormik({
    initialValues: inputdata,
    validationSchema:realestateTypeSchima,
    onSubmit: (values, { setSubmitting }) => {
      axios
        .post(baseURL + "/real-estate-type/", values, {
          headers: headers,
        })
        .then((res) => {
            console.log(res);
            setTypes([...types,res.data])
            resetForm();
            onClose();
        })
        .catch((error) => {
          console.log(error);
          setcustomerror(error.response.data);
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
          // categoryHandleReset()
          // categoryOnClose();
        });
      
    },
  });

  useEffect(() => {
    getObjects("/real-estate-type/", headers, setTypes);
  }, []);

  const typeStatus = (e) => {
    const { value, checked } = e.target;
    axios
    .patch(`${baseURL}/real-estate-type/${value}/`, {is_active:checked}, {
      headers: headers,
    })
    .then((res) => {
      console.log(res);
      const { data } = res;
      const newType = types.map((item) => {
        if (item.id == data.id) {
          item.name = data.name;
          item.is_active = data.is_active;
        }
        return item;
      });
      
      setTypes(newType);
      toast({
        title: "Successfully Update",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    })
    .catch((error) => {
      toast({
        title: "Something wrong try again",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.log(error);
    });
  };



  const handleEdit = (e) => {
    setIsEdit(true);
    const { value } = e.target;
    setId(value);
    const cat = types.filter((e) => e.id == value);

    onOpen();
    setValues({
      name: cat[0]?.name,
      is_active: cat[0]?.is_active,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    // const { value } = brandid.current;
    axios
    .patch(`${baseURL}/real-estate-type/${id}/`, values, {
      headers: headers,
    })
    .then((res) => {
      console.log(res);
      const { data } = res;
      const newType = types.map((item) => {
        if (item.id == data.id) {
          item.name = data.name;
          item.is_active = data.is_active;
        }
        return item;
      });
      
      setTypes(newType);
      toast({
        title: "Successfully Update",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    })
    .catch((error) => {
      toast({
        title: "Something wrong try again",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.log(error);
    });

    onClose();
    resetForm()
  };

  



 

  const handleDelete = (id) => {
    
    setId(id)
    axios
    .delete(`${baseURL}/real-estate-type/${id}/`, {
      headers: headers,
    })
    .then((res) => {
      const object = types.filter((e) => e.id != id);

    //   state = object;
      setTypes(object);
      toast({
        title: "Successfully Delete",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      
    })
    .catch((error) => {
      console.log(error);
      toast({
        title: "Something wrong try again",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    });
  };
  return (
    <>
      <Box>
        <div className="relative overflow-x-auto mt-3 pr-3">
          <Flex
            alignItems={"center"}
            justifyContent={"space-between"}
            p={"0.5rem"}
          >
            <Text as={"h2"} fontSize={"1.3rem"} textAlign={"center"}>
              Realestate Type List
            </Text>
            <Button
              onClick={onOpen}
              backgroundColor={"rgb(34,220,118)"}
              _hover={{ backgroundColor: "rgb(58, 187, 116)" }}
            >
              Add Realestate Type
            </Button>
          </Flex>
          <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {types.map((item, i) => {
                return (
                  <tr
                    className="bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    key={i}
                  >
                    <td
                      scope="row"
                      className="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {item.name}
                    </td>
                    <td className="px-6 py-4">
                    <Switch
                          value={item.id}
                          onChange={typeStatus}
                          isChecked={item.is_active}
                        />
                        
                    </td>
                    <td className="px-6 py-4">
                      <HStack alignItems={"center"} justifyContent={"center"}>
                        <Button
                          aria-label="editbtn"
                          onClick={handleEdit}
                          value={item.id}
                          colorScheme="teal"
                          icon={<BiEdit />}
                        >
                          Edit
                        </Button>

                        <DeleteButton handleDelete={handleDelete} id={item.id}/>
                      </HStack>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Box>

      {/* category modal */}
      <CustomModal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        title="Realestate Type"
        isFooter={true}
        cancelBtnLabel="Cancel"
      >
        <form className="space-y-3 md:space-y-4" onSubmit={handleSubmit}>
          <FormControl isInvalid={errors.name && touched.name}>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              placeholder="RealEstate Type Name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength='20'
            />
            {errors.name && touched.name ? (
              <FormErrorMessage>{errors.name}.</FormErrorMessage>
            ) : null}
            {customerror.name ? (
              <p className="text-red-600">{customerror.name.message}.</p>
            ) : null}
          </FormControl>
          <FormControl isInvalid={errors.is_active && touched.is_active}>
            <FormLabel>Status</FormLabel>
            <Checkbox
                name="is_active"
                value={values.is_active}
                defaultChecked={values.is_active} 
                onChange={handleChange}
                onBlur={handleBlur}
            />
            {errors.is_active && touched.is_active ? (
              <FormErrorMessage>{errors.name}.</FormErrorMessage>
            ) : null}
            {customerror.is_active ? (
              <p className="text-red-600">{customerror.is_active.message}.</p>
            ) : null}
          </FormControl>

          {isEdit ? (
            <button
              className="w-full text-white cursor-pointer bg-[rgb(38,220,118)] hover:bg-[rgb(38,220,118)] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              onClick={handleUpdate}
            >
              Update
            </button>
          ) : (
            <button
              type="submit"
              className="w-full text-white cursor-pointer bg-[rgb(38,220,118)] hover:bg-[rgb(38,220,118)] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              // disabled={isSubmitting}
            >
              Save
            </button>
          )}
        </form>
      </CustomModal>
    </>
  );
}

export default RequireAuth(RealestateType);
