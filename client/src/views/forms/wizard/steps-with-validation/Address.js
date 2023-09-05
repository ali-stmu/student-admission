import React, { Fragment, useState, useEffect } from "react";
import classnames from "classnames";
import Select from "react-select";
import { selectThemeColors, isObjEmpty } from "@utils";
import { useForm } from "react-hook-form";
import { BASE_URL } from "../../../../config";
import { ArrowLeft, ArrowRight } from "react-feather";

import {
  Label,
  FormGroup,
  Row,
  Col,
  Button,
  Form,
  Input,
  CustomInput,
} from "reactstrap";
const Address = ({ stepper, type }) => {
  const { register, errors, handleSubmit, trigger } = useForm();
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [zipcode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [taddress, settAddress] = useState("");
  const [tcountry, settCountry] = useState("");
  const [tzipcode, settZipCode] = useState("");
  const [tcity, settCity] = useState("");
  const [tstate, settState] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [user_id, setUserId] = useState("");
  const user_id_temp = new FormData();
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const data = {
    address,
    country,
    zipcode,
    city,
    state,
    taddress,
    tcountry,
    tzipcode,
    tcity,
    tstate,
    user_id,
  };
  useEffect(() => {
    const rolesFromStorage = localStorage.getItem("StudentInfo");
    const studentInfo = JSON.parse(rolesFromStorage);
    const TempUserid = studentInfo.user_id;
    setUserId(TempUserid);
    user_id_temp.append("user_id", TempUserid);
    fetch(`${BASE_URL}useeffectstudentdataaddress`, {
      method: "POST",
      body: user_id_temp,
    })
      .then((response) => response.json())
      .then((data) => {
        setAddress(data.StudentInfo.address);
        setZipCode(data.StudentInfo.zip_code);
        setCity(data.StudentInfo.city);
        setCountry(data.StudentInfo.country);
        setState(data.StudentInfo.state);
        settAddress(data.StudentInfo.t_address);
        settCountry(data.StudentInfo.t_country);
        settZipCode(data.StudentInfo.t_zip_code);
        settCity(data.StudentInfo.t_city);
        settState(data.StudentInfo.t_state);
      })
      .catch((error) => console.error(error));
  }, []);
  useEffect(() => {
    // Fetch the list of countries from an API
    fetch("https://restcountries.com/v2/all")
      .then((response) => response.json())
      .then((data) => {
        // Transform the data into the required format for Select component
        const countryOptions = data.map((country) => ({
          label: country.name,
          value: country.name,
        }));
        setCountries(countryOptions);
      })
      .catch((error) => console.error(error));
  }, []);
  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };
  console.log(selectedOption.label);
  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
  
    // Fetch states based on the selected country
    fetch(`https://restcountries.com/v2/name/${selectedOption.label}`)
      .then((response) => response.json())
      .then((data) => {
        // Check if data is available and has states information
        if (Array.isArray(data) && data.length > 0 && data[0].states) {
          const stateOptions = data[0].states.map((state) => ({
            label: state.name,
            value: state.name,
          }));
          setStates(stateOptions);
        } else {
          // If no states information is available, clear the state dropdown
          setStates([]);
          setSelectedState(null);
        }
      })
      .catch((error) => {
        console.error(error);
        // Handle errors here, e.g., show an error message to the user
      });
  };
  
  const handleZipcodeChange = (event) => {
    setZipCode(event.target.value);
  };
  const handleCityChange = (event) => {
    setCity(event.target.value);
  };
  const handleStateChange = (event) => {
    setState(event.target.value);
  };
  const handletAddressChange = (event) => {
    settAddress(event.target.value);
  };
  // const handletCountryChange = (event) => {
  //   settCountry(event.target.value);
  // };
  const handletZipcodeChange = (event) => {
    settZipCode(event.target.value);
  };
  const handletCityChange = (event) => {
    settCity(event.target.value);
  };
  const handletStateChange = (event) => {
    settState(event.target.value);
  };
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    console.log(isChecked);
    if (isChecked === false) {
      setAddress(taddress);
      setCountry(tcountry);
      setZipCode(tzipcode);
      setState(tstate);
      setCity(tcity);
    } else if (isChecked === true) {
      setAddress("");
      setCountry("");
      setZipCode("");
      setState("");
      setCity("");
    }
  };
  const onSubmit = () => {
    trigger();
    if (isObjEmpty(errors)) {
      stepper.next();
    }
    fetch(`${BASE_URL}storeStudentDataAddress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };
  //console.log(JSON.stringify(data));

  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">Address</h5>
        <h4>Enter Your Temporary Address.</h4>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <FormGroup tag={Col} md="6">
            <Label className="form-label" for={`address-${type}`}>
              Street Address<sup>*</sup>
            </Label>
            <Input
              type="text"
              id={`address-${type}`}
              name={`address-${type}`}
              placeholder="98  Borough bridge Road, Birmingham"
              innerRef={register({ required: true })}
              className={classnames({
                "is-invalid": errors[`address-${type}`],
              })}
              value={taddress}
              onChange={handletAddressChange}
            />
          </FormGroup>
          <FormGroup tag={Col} md="6">
            <Label className="form-label" for={`landmark-${type}`}>
              Country<sup>*</sup>
            </Label>
            <Select
              theme={selectThemeColors}
              className="react-select"
              classNamePrefix="select"
              options={countries}
              value={selectedCountry}
              onChange={handleCountryChange}
              isSearchable={true}
            />
          </FormGroup>
        </Row>
        <Row>
        <FormGroup tag={Col} md="6">
            <Label className="form-label" for={`state-${type}`}>
              State<sup>*</sup>
            </Label>
            <Select
              theme={selectThemeColors}
              className="react-select"
              classNamePrefix="select"
              options={states}
              value={selectedState}
              onChange={(selectedOption) => setSelectedState(selectedOption)}
              isSearchable={true}
              id={`state-${type}`}
            />
          </FormGroup>
          <FormGroup tag={Col} md="6">
            <Label className="form-label" for={`city-${type}`}>
              City<sup>*</sup>
            </Label>
            <Input
              type="text"
              name={`city-${type}`}
              id={`city-${type}`}
              placeholder="Islamabad"
              innerRef={register({ required: true })}
              className={classnames({
                "is-invalid": errors[`city-${type}`],
              })}
              value={tcity}
              onChange={handletCityChange}
            />
          </FormGroup>
        </Row>
        <Row>
          <FormGroup tag={Col} md="6">
            <Label className="form-label" for={`pincode-${type}`}>
              Zip code<sup>*</sup>
            </Label>
            <Input
              type="text"
              name={`pincode-${type}`}
              id={`pincode-${type}`}
              placeholder="658921"
              innerRef={register({ required: true })}
              className={classnames({
                "is-invalid": errors[`pincode-${type}`],
              })}
              value={tzipcode}
              onChange={handletZipcodeChange}
            />
          </FormGroup>
        </Row>
        <div className="content-header">
          <h4>Enter Your Permannt Address.</h4>
          <CustomInput
            inline
            type="switch"
            id="exampleCustomCheckbox2"
            label="Same as Temporary Address"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />{" "}
        </div>
        {isChecked ? null : (
          <div id="temporary_address">
            <Row>
              <FormGroup tag={Col} md="6">
                <Label className="form-label" for={`address-${type}`}>
                  Address
                </Label>
                <Input
                  type="text"
                  id={`address-${type}`}
                  name={`address-${type}`}
                  placeholder="98  Borough bridge Road, Birmingham"
                  innerRef={register({ required: true })}
                  className={classnames({
                    "is-invalid": errors[`address-${type}`],
                  })}
                  value={address}
                  onChange={handleAddressChange}
                />
              </FormGroup>
              <FormGroup tag={Col} md="6">
                <Label className="form-label" for={`landmark-${type}`}>
                  Country
                </Label>
                <Input
                  type="text"
                  name={`landmark-${type}`}
                  id={`landmark-${type}`}
                  placeholder="Pakistan"
                  innerRef={register({ required: true })}
                  className={classnames({
                    "is-invalid": errors[`landmark-${type}`],
                  })}
                  value={country}
                  onChange={handleCountryChange}
                />
              </FormGroup>
            </Row>
            <Row>
              <FormGroup tag={Col} md="6">
                <Label className="form-label" for={`city-${type}`}>
                  State
                </Label>
                <Input
                  type="text"
                  name={`city-${type}`}
                  id={`city-${type}`}
                  placeholder="Punjab"
                  innerRef={register({ required: true })}
                  className={classnames({
                    "is-invalid": errors[`city-${type}`],
                  })}
                  value={state}
                  onChange={handleStateChange}
                />
              </FormGroup>
              <FormGroup tag={Col} md="6">
                <Label className="form-label" for={`city-${type}`}>
                  City
                </Label>
                <Input
                  type="text"
                  name={`city-${type}`}
                  id={`city-${type}`}
                  placeholder="Islamabad"
                  innerRef={register({ required: true })}
                  className={classnames({
                    "is-invalid": errors[`city-${type}`],
                  })}
                  value={city}
                  onChange={handleCityChange}
                />
              </FormGroup>
            </Row>
            <Row>
              <FormGroup tag={Col} md="6">
                <Label className="form-label" for={`pincode-${type}`}>
                  Zip code
                </Label>
                <Input
                  type="text"
                  name={`pincode-${type}`}
                  id={`pincode-${type}`}
                  placeholder="658921"
                  innerRef={register({ required: true })}
                  className={classnames({
                    "is-invalid": errors[`pincode-${type}`],
                  })}
                  value={zipcode}
                  onChange={handleZipcodeChange}
                />
              </FormGroup>
            </Row>
          </div>
        )}

        <div className="d-flex justify-content-between">
          <Button.Ripple
            color="primary"
            className="btn-prev"
            onClick={() => stepper.previous()}
          >
            <ArrowLeft
              size={14}
              className="align-middle mr-sm-25 mr-0"
            ></ArrowLeft>
            <span className="align-middle d-sm-inline-block d-none">
              Previous
            </span>
          </Button.Ripple>
          <Button.Ripple type="submit" color="primary" className="btn-next">
            <span className="align-middle d-sm-inline-block d-none">Next</span>
            <ArrowRight
              size={14}
              className="align-middle ml-sm-25 ml-0"
            ></ArrowRight>
          </Button.Ripple>
        </div>
      </Form>
    </Fragment>
  );
};

export default Address;
