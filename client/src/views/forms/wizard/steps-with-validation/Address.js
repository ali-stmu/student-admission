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
  const [selectedCountryPermanent, setSelectedCountryPermanent] =
    useState(null);
  const [states, setStates] = useState([]);
  const [statesPermanent, setStatesPermanent] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedStatePermanent, setSelectedStatePermanent] = useState(null);

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
        console.log(data);
        setAddress(data.StudentInfo.address);
        setZipCode(data.StudentInfo.zip_code);
        setCity(data.StudentInfo.city);
        setCountry(data.StudentInfo.country);
        setSelectedCountryPermanent({
          label: data.StudentInfo.country,
          value: data.StudentInfo.country,
        });
        setState(data.StudentInfo.state);
        setSelectedStatePermanent({
          label: data.StudentInfo.state,
          value: data.StudentInfo.state,
        });
        settAddress(data.StudentInfo.t_address);
        settCountry(data.StudentInfo.t_country);
        setSelectedCountry({
          label: data.StudentInfo.t_country,
          value: data.StudentInfo.t_country,
        });
        settZipCode(data.StudentInfo.t_zip_code);
        settCity(data.StudentInfo.t_city);
        settState(data.StudentInfo.t_state);
        setSelectedState({
          label: data.StudentInfo.t_state,
          value: data.StudentInfo.t_state,
        });
      })
      .catch((error) => console.error(error));
  }, []);
  useEffect(() => {
    fetch(`${BASE_URL}countries`) // Replace BASE_URL with your Laravel API URL
      .then((response) => response.json())
      .then((data) => {
        // Assuming your Laravel API returns the countries in the expected format
        const countryOptions = data.countries.map((country) => ({
          label: country.name,
          value: country.name,
          code: country.code,
        }));
        setCountries(countryOptions);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleddStateChange = (selectedOption) => {
    setSelectedState(selectedOption);
    settState(selectedOption.label);
  };
  const handleddStateChangePermanent = (selectedOption) => {
    setSelectedStatePermanent(selectedOption);
    setState(selectedOption.label);
  };
  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    settCountry(selectedOption.label);
    console.log("Selected Country:", selectedOption.label);

    // Fetch states based on the selected country
    fetch(`${BASE_URL}states?country_code=${selectedOption.code}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        // Check if data is available and has states information
        if (Array.isArray(data) && data.length > 0) {
          const stateArray = data.map((state) => ({
            id: state.id,
            label: state.state_name,
            value: state.state_name,
            state_code: state.state_code,
            // Add other properties as needed
          }));
          setStates(stateArray);
          setSelectedState(stateArray.length > 0 ? stateArray[0] : null);
        } else {
          // Handle the case where there is no state information
          console.error("No state data available");
          setStates([]); // Clear the states array
        }
      })
      .catch((error) => {
        console.error(error);
        // Handle errors here, e.g., show an error message to the user
      });
  };

  const handleCountryChangePermanent = (selectedOption) => {
    setSelectedCountryPermanent(selectedOption);
    setCountry(selectedOption.label);
    console.log("Selected Country:", selectedOption.label);

    // Fetch states based on the selected country
    fetch(`${BASE_URL}states?country_code=${selectedOption.code}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        // Check if data is available and has states information
        if (Array.isArray(data) && data.length > 0) {
          const stateArray = data.map((state) => ({
            id: state.id,
            label: state.state_name,
            value: state.state_name,
            state_code: state.state_code,
            // Add other properties as needed
          }));
          setStatesPermanent(stateArray);
          setSelectedStatePermanent(
            stateArray.length > 0 ? stateArray[0] : null
          );
        } else {
          // Handle the case where there is no state information
          console.error("No state data available");
          setStatesPermanent([]); // Clear the states array
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
              onChange={handleddStateChange}
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
          <h4>Enter Your Permanent Address.</h4>
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
                  Country<sup>*</sup>
                </Label>
                <Select
                  theme={selectThemeColors}
                  className="react-select"
                  classNamePrefix="select"
                  options={countries}
                  value={selectedCountryPermanent}
                  onChange={handleCountryChangePermanent}
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
                  options={statesPermanent}
                  value={selectedStatePermanent}
                  onChange={handleddStateChangePermanent}
                  isSearchable={true}
                  id={`state-${type}`}
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
            <span className="align-middle d-sm-inline-block d-none">
              Save & Next
            </span>
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
