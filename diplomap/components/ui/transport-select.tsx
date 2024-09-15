import { ChangeEvent, useState } from "react";
interface Option {
  value: string;
  label: string;
  emissions: number;
}

interface Props {
  options: Option[];
  tripLength: number;
}

const CustomSelect = ({ options, tripLength }: Props) => {
  const [selectedValue, setSelectedValue] = useState<string>("");

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value);
  };
  const emcount = (
    Number(
      options.find((option) => option.value === selectedValue)?.emissions
    ) * tripLength
  ).toFixed(2);
  let color;

  if (Number(emcount) < 10) {
    color = "green";
  } else if (Number(emcount) < 150) {
    color = "yellow";
  } else {
    color = "red";
  }
  const indicatorStyle = {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: color,
  };
  return (
    <div>
      <select value={selectedValue} onChange={handleSelectChange}>
        <option value="" disabled hidden className="font-semibold text-l">
          Choose transport
        </option>
        {options.map((option, index) => (
          <option
            key={index}
            value={option.value}
            className="font-semibold text-l"
          >
            {option.label}
          </option>
        ))}
      </select>
      {selectedValue && (
        <p className="flex font-semibold text-l">
          You will produce about {emcount} kg of CO2 during this trip{" "}
          <span style={indicatorStyle}></span>
        </p>
      )}
    </div>
  );
};

export default CustomSelect;
