"use client"
import { useState } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface FormInputProps {
  control: any;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  description?: string;
  step?: string;
  endAdornment?: React.ReactNode;
}

const FormInput: React.FC<FormInputProps> = ({
  control,
  name,
  label,
  placeholder,
  type = "text",
  description,
  step,
  endAdornment,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                placeholder={placeholder}
                type={type === "password" && showPassword ? "text" : type}
                step={step}
                {...field}
                value={field.value ?? ''}
                onChange={(e) => {
                  if (type === "number") {
                    const value = e.target.value;
                    // Convert to number: integer for whole numbers, float for decimals
                    const numValue = step && step.includes('.') ? parseFloat(value) : parseInt(value, 10);
                    field.onChange(value === '' ? '' : isNaN(numValue) ? field.value : numValue);
                  } else {
                    field.onChange(e.target.value);
                  }
                }}
                className="border-gray-300 rounded-md"
              />
              {type === "password" && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              )}
              {endAdornment}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInput;