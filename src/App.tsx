import ParamEditor, { Param, Model } from "./ParamEditor"




const params: Param[] = [
	{
		id: 1,
		name: "Назначение",
		type: "string",
	},
	{
		id: 2,
		name: "Длина",
		type: "string",
	},
]
const model: Model = {
	paramValues: [
		{
			paramId: 1,
			value: "Повседневное"
		},
		{
			paramId: 2,
			value: "Макси"
		},
	]
}


function App() {
  return (
		<ParamEditor
			model = { model }
			params = { params }
		/>
	);
}





export default App;
