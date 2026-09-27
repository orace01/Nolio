"use client";

import styles from "./Segmented.module.css";

type SegmentedProps<T extends string> = {
  name: string;
  legend: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (value: T) => void;
  className?: string;
};

export function Segmented<T extends string>({
  name,
  legend,
  value,
  options,
  onChange,
  className,
}: SegmentedProps<T>) {
  return (
    <fieldset className={className ? `${styles.group} ${className}` : styles.group}>
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.options}>
        {options.map((option) => (
          <label key={option.id} className={styles.option}>
            <input
              type="radio"
              name={name}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
