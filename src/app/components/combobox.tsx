import { Input, InputBase, Combobox as MCombobox, useCombobox } from '@mantine/core';

type TProps = {
  options: string[];
  value: string | null;
  onChange: (value: string) => void;
}

export const Combobox = (p: TProps) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  return (
    <MCombobox
      store={combobox}
      onOptionSubmit={(val) => {
        p.onChange(val);
        combobox.closeDropdown();
      }}
    >
      <MCombobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<MCombobox.Chevron />}
          rightSectionPointerEvents="none"
          onClick={() => combobox.toggleDropdown()}
        >
          {p.value || <Input.Placeholder>Pick value</Input.Placeholder>}
        </InputBase>
      </MCombobox.Target>

      <MCombobox.Dropdown>
        <MCombobox.Options>
          {p.options.map((item) => (
            <MCombobox.Option value={item} key={item}>
              {item}
            </MCombobox.Option>
          ))}
        </MCombobox.Options>
      </MCombobox.Dropdown>
    </MCombobox>
  );
};