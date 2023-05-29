import { Fragment, useState } from "react";
import classnames from "classnames";
import { isObjEmpty } from "@utils";
import { useForm } from "react-hook-form";
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
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };
  const handleCountryChange = (event) => {
    setCountry(event.target.value);
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
  const handletCountryChange = (event) => {
    settCountry(event.target.value);
  };
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
    fetch("https://example.com/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };
  console.log(JSON.stringify(data));

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
              value={taddress}
              onChange={handletAddressChange}
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
              value={tcountry}
              onChange={handletCountryChange}
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
              value={tzipcode}
              onChange={handletZipcodeChange}
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
              value={tcity}
              onChange={handletCityChange}
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
              value={tstate}
              onChange={handletStateChange}
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
