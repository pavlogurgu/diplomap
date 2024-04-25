// import {
//     Select,
//     SelectContent,
//     SelectGroup,
//     SelectItem,
//     SelectLabel,
//     SelectTrigger,
//     SelectValue,
//   } from "@/components/ui/select"
//   const emissionsPerKilometer = {
//     car: 0.2,
//     bus: 0.1,
//     train: 0.05,
//     plane: 0.3,
//     motorcycle: 0.25,
//   };
//   import { ChangeEvent, useState } from 'react';

//   interface SelectProps {
//     options: { value: string; label: string }[];
//   }
  
//   const TransportSelect: React.FC<SelectProps> = ({ options }) => {
//     const [selectedValue, setSelectedValue] = useState<string>('');
  
//     const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
//       setSelectedValue(event.target.value);
//     };
  
//     return (
//       <div>



// <p>Яким саме транспортом плануєте їхати?</p>

//   <Select value={selectedValue} onChange={handleSelectChange} >
// <SelectTrigger className="w-[180px]">
//   <SelectValue placeholder="Виберіть транспорт" />
// </SelectTrigger>
// <SelectContent>
//   <SelectGroup>
//     <SelectLabel>Вибрати</SelectLabel>
//     <SelectItem value="car">Машина</SelectItem>
//     <SelectItem value="bus">Автобус</SelectItem>
//     <SelectItem value="train">Поїзд</SelectItem>
//     <SelectItem value="plane">Літак</SelectItem>
//     <SelectItem value="motorcycle">Мотоцикл</SelectItem>
//   </SelectGroup>
// </SelectContent>
// </Select>
// <p>Ваші викиди за цю подорож становитимуть:  кг</p>







//         <select value={selectedValue} onChange={handleSelectChange}>
//           {options.map((option, index) => (
//             <option key={index} value={option.value}>
//               {option.label}
//             </option>
//           ))}
//         </select>
//         {selectedValue && (
//           <p>Вибране значення: {options.find((option) => option.value === selectedValue)?.label}</p>
//         )}
//       </div>
//     );
//   };
  
//   export default TransportSelect;

import { ChangeEvent, useState } from 'react';
interface Option {
  value: string;
  label: string;
  emissions: number
}

interface Props {
  options: Option[];
  tripLength: number
}

const CustomSelect = ({ options, tripLength }: Props) => {
  const [selectedValue, setSelectedValue] = useState<string>('');

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value);
  };
  const emcount = (Number(options.find((option) => option.value === selectedValue)?.emissions)*tripLength).toFixed(2)

  return (
    <div>
      <select value={selectedValue} onChange={handleSelectChange}>
      <option value="" disabled hidden>Виберіть транспорт</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {selectedValue && (
        <p>Викидів СО2 для цієї подорожі близько {emcount} кг на людину</p>
      )}
    </div>
  );
};

export default CustomSelect;
