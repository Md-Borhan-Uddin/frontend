import React, { useEffect, useRef, useState } from "react";
import DashboardLayout from "../DashboardLayout";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Input,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import CustomModal from "../../../components/UserEditModal";
import { useFormik } from "formik";
import { categoryANDBrandSchima } from "../../../Schima";
import axios from "axios";
import { baseURL, baseUrl } from "../../../utility/baseURL";
import { getUser } from "../../../utility/authentication";
import { BsTrash3 } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { deleteItem, editItem, getObjects } from "../../../utility/category_brand";
import RequireAuth from "../../../components/auth/TokenExpaireCheck";

// const categorys = [{ name: "bangladesh" }, { name: "india" }];

const inputdata = {
  name: "",
  is_active: false,
};

function CategoryBrand() {
  const [categorys, setCategorys] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [brands, setBrands] = useState([]);
  const [id,setId] = useState()
  const router = useNavigate();
  const toast = useToast();
  const [customerror, setcustomerror] = useState({});
  const {
    isOpen: categoryIsOpen,
    onClose: categoryOnClose,
    onOpen: categoryOnOpen,
  } = useDisclosure();
  const {
    isOpen: brandIsOpen,
    onClose: brandOnClose,
    onOpen: brandOnOpen,
  } = useDisclosure();
  const statusCheck = useRef();
  const brandid = useRef();
  const categoryId = useRef();
  const { access_token } = getUser();

  const headers = {
    Authorization: "Bearer " + String(access_token), //the token is a variable which holds the token
  };

  const {
    values: categoryValues,
    errors: categoryErrors,
    setValues: categorySetValues,
    handleChange: categoryHandleChange,
    handleSubmit: categoryHandleSubmit,
    handleReset: categoryHandleReset,
    touched: categoryTouched,
  } = useFormik({
    initialValues: inputdata,
    validationSchema: categoryANDBrandSchima,
    onSubmit: (values, { setSubmitting }) => {
      
      axios
        .post(baseURL + "/assert-type/", values, {
          headers: headers,
        })
        .then((res) => {
          console.log(res);
          setCategorys([...categorys, res.data]);

          toast({
            title: "Category Add Successfully",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        })
        .catch((error) => {
          console.log(error.response.data.non_field_errors);
          setcustomerror(error.response.data)
          if(error.response.data.non_field_errors){
            error.response.data.non_field_errors.map((message)=>{

              toast({
                title: message,
                status: "error",
                duration: 3000,
                isClosable: true,
              });
            })
          }
          if (error.response.status == 401) {
            toast({
              title: "You are not Login Login First",
              status: "error",
              duration: 2000,
              isClosable: true,
            });
            router.push("/account/login");
          }
        });
        categoryHandleReset()
        categoryOnClose();

      //   onClose();
      //   window.location.reload();
    },
  });

  const {
    values: brandValues,
    errors: brandErrors,
    setValues: brandSetValues,
    handleChange: brandHandleChange,
    handleSubmit: brandHandleSubmit,
    handleReset: brandHandleReset,
    touched: brandTouched,
  } = useFormik({
    initialValues: inputdata,
    validationSchema: categoryANDBrandSchima,
    onSubmit: (values, { setSubmitting }) => {
      brandHandleReset()
      axios
        .post(baseURL + "/assert-brand/", values, {
          headers: headers,
        })
        .then((res) => {
          console.log(res);
          setBrands([...brands, res.data]);
          
        })
        .catch((error) => {
          console.log(error);
          setcustomerror(error.response.data)
          if(error.response.data.non_field_errors){
            error.response.data.non_field_errors.map((message)=>{

              toast({
                title: message,
                status: "error",
                duration: 3000,
                isClosable: true,
              });
            })
          }
          if (error.response.status == 401) {
            toast({
              title: "You are not Login Login First",
              status: "error",
              duration: 2000,
              isClosable: true,
            });
            router.push("/account/login");
          }
          // categoryHandleReset()
          // categoryOnClose();
        });
        brandHandleReset()
        brandOnClose();
    },
  });


  useEffect(() => {
    getObjects("/assert-type/", headers, setCategorys);
    getObjects("/assert-brand/", headers, setBrands);
  }, []);

  const categoryEdit = (e) => {
    setIsEdit(true);
    const { value } = e.target;
    setId(value)
    const cat = categorys.filter((e) => e.id == value);
    categoryOnOpen();
    categorySetValues({
      name: cat[0]?.name,
      is_active: cat[0]?.is_active,
    });
  };

  const brandEdit = (e) => {
    setIsEdit(true);
    const { value } = e.target;
    setId(value)
    const cat = brands.filter((e) => e.id == value);

    brandOnOpen();
    brandSetValues({
      name: cat[0]?.name,
      is_active: cat[0]?.is_active,
    });
  };

  const brandUpdate = (e) => {
    e.preventDefault();
    // const { value } = brandid.current;
    const res = editItem(
      "/assert-brand/",
      headers,
      id,
      brandValues,
      brandSetValues,
      brands,
      toast
    );
    
    brandOnClose();
  };

  const categoryUpdate = (e) => {
    e.preventDefault();
    // const { value } = categoryId.current;
    const res = editItem(
      "/assert-type/",
      headers,
      id,
      categoryValues,
      categorySetValues,
      categorys,
      toast
    );
    
    categoryOnClose();
  };

  const statusHandler = (e) => {
    const { value, checked } = e.target;
    // setStatus(!checked);
    if (value) {
      console.log("data");
      // statusOnOpen();
      fetchdata(value, {});
    } else {
      const { value } = userid.current;
      const { checked } = statusCheck.current;
      fetchdata(value, { is_active: !checked }, true);
      // statusOnClose();
      // console.log("save", e);
      window.location.reload();
    }
  };

  const categoryDelete = (e) => {
    const { value } = e.target;

    const res = deleteItem(
      "/assert-type/",
      headers,
      value,
      setCategorys,
      categorys,
      toast
    );
    
  };

  const brandDelete = (e) => {
    const { value } = e.target;

    const res = deleteItem("/assert-brand/", headers, value, setBrands, brands,toast);
    
  };
  return (
    <>
      <Flex gap={3}>
      <Box w={{base:'100%',md:'50%'}} pl={'10px'}>
          <Flex
            alignItems={"center"}
            justifyContent={"space-between"}
            p={"0.5rem"}
          >
            <Text as={"h2"} fontSize={"1.3rem"} textAlign={"center"}>
              Category List
            </Text>
            <Button
              onClick={() => {
                categoryHandleReset();
                setIsEdit(false);
                categoryOnOpen();
              }}
              backgroundColor={"rgb(34,220,118)"}
              _hover={{ backgroundColor: "rgb(58, 187, 116)" }}
            >
              Add category
            </Button>
          </Flex>
          <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  name
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
              {categorys.map((item, i) => {
                return (
                  <tr
                    className="bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    key={i}
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {item.name}
                    </th>
                    <td className="px-6 py-4">
                      <label className="relative inline-flex items-center mb-4 cursor-pointer">
                        <input
                          type="checkbox"
                          value={item.id}
                          onChange={statusHandler}
                          className="sr-only peer"
                          checked={item.is_active}
                          ref={statusCheck}
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </td>
                    <td className="px-6 py-4">
                      <HStack alignItems={"center"} justifyContent={"center"}>
                        <Button
                          aria-label="editbtn"
                          onClick={categoryEdit}
                          colorScheme="teal"
                          value={item.id}
                          icon={<BiEdit />}
                        >
                          Edit
                        </Button>

                        <Button
                          aria-label="deletebtn"
                          icon={<BsTrash3 values={item.id} />}
                          onClick={categoryDelete}
                          colorScheme="red"
                          value={item.id}
                        >
                          Delete
                        </Button>
                      </HStack>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Box>
        <Box w={{base:'100%',md:'50%'}} pr={'10px'}>
          <Flex
            alignItems={"center"}
            justifyContent={"space-between"}
            p={"0.5rem"}
          >
            <Text as={"h2"} fontSize={"1.3rem"} textAlign={"center"}>
              Brand List
            </Text>
            <Button
              onClick={()=>{brandHandleReset();setIsEdit(false); brandOnOpen()}}
              backgroundColor={"rgb(34,220,118)"}
              _hover={{ backgroundColor: "rgb(58, 187, 116)" }}
            >
              Add Brand
            </Button>
          </Flex>
          <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  name
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
              {brands.map((item, i) => {
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
                      <label className="relative inline-flex items-center mb-4 cursor-pointer">
                        <input
                          type="checkbox"
                          value={item.is_active}
                          onChange={statusHandler}
                          className="sr-only peer"
                          checked={item.is_active}
                          ref={statusCheck}
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </td>
                    <td className="px-6 py-4">
                      <HStack alignItems={"center"} justifyContent={"center"}>
                        <Button
                          aria-label="editbtn"
                          onClick={brandEdit}
                          value={item.id}
                          colorScheme="teal"
                          icon={<BiEdit />}
                        >
                          Edit
                        </Button>

                        <Button
                          aria-label="deletebtn"
                          icon={<BsTrash3 />}
                          onClick={brandDelete}
                          value={item.id}
                          colorScheme="red"
                          ref={brandid}
                        >
                          Delete
                        </Button>
                      </HStack>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Box>
      </Flex>

      {/* category modal */}
      <CustomModal
        isOpen={categoryIsOpen}
        onClose={categoryOnClose}
        closeOnOverlayClick={false}
        title="Edit User"
        isFooter={true}
        cancelBtnLabel="Cancle"
      >
        <form
          className="space-y-3 md:space-y-4"
          onSubmit={categoryHandleSubmit}
        >
          <FormControl isInvalid={categoryErrors.name}>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              placeholder="category Name"
              value={categoryValues.name}
              onChange={categoryHandleChange}
            />
            {categoryErrors.name && categoryTouched.name ? (
              <FormErrorMessage>{categoryErrors.name}.</FormErrorMessage>
            ) : null}
            {customerror.name ? (
              <p className="text-red-600">{customerror.name.message}.</p>
            ) : null}
          </FormControl>
          <FormControl isInvalid={categoryErrors.is_active && categoryTouched.is_active}>
            <Checkbox
              onChange={categoryHandleChange}
              name="is_active"
              isChecked={
                categoryValues.is_active ? categoryValues.is_active : false
              }
              value={categorys.is_active}
            >
              Active
            </Checkbox>
            {categoryErrors.is_active && categoryTouched.is_active ? (
              <FormErrorMessage>{categoryErrors.is_active}.</FormErrorMessage>
            ) : null}
            {customerror.is_active ? (
              <p className="text-red-600">{customerror.is_active.message}.</p>
            ) : null}
          </FormControl>
          {isEdit ? (
            <button
              className="w-full text-white cursor-pointer bg-[rgb(38,220,118)] hover:bg-[rgb(38,220,118)] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              onClick={categoryUpdate}
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

      {/* Berand modal */}
      <CustomModal
        isOpen={brandIsOpen}
        onClose={brandOnClose}
        closeOnOverlayClick={false}
        title="Edit User"
        isFooter={true}
        cancelBtnLabel="Cancle"
      >
        <form className="space-y-3 md:space-y-4" onSubmit={brandHandleSubmit}>
          <FormControl isInvalid={brandErrors.name && brandTouched.name}>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              placeholder="brand Name"
              value={brandValues.name}
              onChange={brandHandleChange}
            />
            {brandErrors.name && brandTouched.name ? (
              <FormErrorMessage>{brandErrors.name}.</FormErrorMessage>
            ) : null}
            {customerror.name ? (
              <p className="text-red-600">{customerror.name.message}.</p>
            ) : null}
          </FormControl>
          <FormControl isInvalid={brandErrors.is_active}>
            <Checkbox
              onChange={brandHandleChange}
              name="is_active"
              isChecked={brandValues.is_active ? brandValues.is_active : false}
              value={brandValues.is_active}
            >
              Active
            </Checkbox>
            {brandErrors.name && brandTouched.name ? (
              <FormErrorMessage>{brandErrors.name}.</FormErrorMessage>
            ) : null}
            {customerror.name ? (
              <p className="text-red-600">{customerror.name.message}.</p>
            ) : null}
          </FormControl>
          {isEdit ? (
            <button
              className="w-full text-white cursor-pointer bg-[rgb(38,220,118)] hover:bg-[rgb(38,220,118)] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              onClick={brandUpdate}
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


export default RequireAuth(CategoryBrand)