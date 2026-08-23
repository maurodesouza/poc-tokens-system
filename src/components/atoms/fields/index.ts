import { Input as InputControl } from "./input";
import { Numeric } from "./numeric";
import { Template } from "./templates";
import { Textarea } from "./textarea";

// Input é o controle nu (função) + namespace Template anexado.
// Acesso: <Input />, <Input.Template.Simple label="..." />
const Input = Object.assign(InputControl, { Template });

export const AtomsFields = {
	Input,
	Textarea,
	Numeric,
};

export { Input, Textarea, Numeric };
