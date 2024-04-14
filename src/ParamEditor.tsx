import  { Component, FC, ChangeEvent, ChangeEventHandler, ReactNode } from 'react';

const sectionStyle = {
	padding: "15px 25px",
}
const footerState = {
	padding: "10px 25px"
}
const labelBoxStyle = {
	display: "grid",
	gridAutoRows: "30px",
	gridTemplateColumns: "120px 200px",
	alignItems: "center",
}

interface Color {}
export interface Param {
	id: number;
	name: string;
	type?: string;
}
interface ParamValue {
	paramId: number;
	value: string;
	options?: string[];
}
export interface Model {
	paramValues: ParamValue[]
	colors?: Color[]
}
interface Props {
	params: Param[];
	model: Model;
}
interface State {
	[key: number]: string 
}
interface ILabel {
	id: number
	name: string;
	children: ReactNode
}
interface ITextInput {
	id: number,
	value: string ,
	onHandleChange: ChangeEventHandler<HTMLInputElement>
}
interface ISelectInput {
	id: number;
	value: string;
	options: string[];
	handleChangeSelect: ChangeEventHandler<HTMLSelectElement>;
}

// для построения this.state в ParamEditor
function createsStateFormModel(data: ParamValue[]) {
	const obj: { [key:number]: string } = { }
	data.forEach(({ paramId, value }) => {
			obj[paramId] = value;
	})
	return obj
}

// постоянное поле, которое строит тип Param.
const Label: FC<ILabel> = ({id, name = "", children } ) =>  (
	<div
		style = { labelBoxStyle }
	>
		<label
			htmlFor= { "" + id }
		>
			{ name }
		</label>
			{ children }
	</div>
)

// компонент для построения текстовых полей
// можно расширитье его возможности, если в него передавать type.
const TextInput: FC<ITextInput> = ( {id,  value = "", onHandleChange } ) =>  (
	<input
		id = { "" + id }
		type = {"string" }
		value = { value }
		onChange = { onHandleChange	 }
	/>
)
// компонент для построения полей со списком
const SelectInput: FC<ISelectInput> = ({id, options = [], value = "", handleChangeSelect}) => (
	<select
		value = { value }
		id = { "" + id }
		onChange = { handleChangeSelect }
	>
		{
			options.map((it) => {
				return (
					<option
						key = { it }
						value = { it }
					>
						{ it }
					</option>
				)
			})
		}
	</select>
)

class ParamEditor extends Component< Props, State > {

	constructor( props: Props ) {
		super(props);
		// создаём state из структуры Model
		// сохраняем и ищем занчение по paramId, то есть по числовому ключу id
		this.state = createsStateFormModel( props.model.paramValues )
		// привязываем методы к данному классу
		// так как они будут передаваться в html объекты
		// и this методов, без привзяки контектса, станет равным html объекта.
		// а мне нужен доступ из метода к this.setState.
		this.onHandleChangeTextInput = this.onHandleChangeTextInput.bind(this)
		this.onHandleChangeSelect = this.onHandleChangeSelect.bind( this )
	}

	public getModel(): Model {		
		// как и показано в задании, метод возвращает структуру Model.
		return {
			paramValues: [ ...Object.entries( this.state )
												.map( ( [ id, value ] ) => {
													return {
														paramId: + id,
														value,
													}
												} )
									]
		}
	}

	// приложение получилось легко масштабируемым, так как
	// метод для изменения текстовых полей и полей со списками
	// одинаковый ( Выше есть сам компонент для построения списков )

	// метод для изменения списков
	protected onHandleChangeSelect( e: ChangeEvent<HTMLSelectElement> ) {
		const { id, value } = e.target;
		this.setState( prev => ( { ...prev, [ id ]: value } ) )
	}
	// метод для изменения текстовых полей
	protected onHandleChangeTextInput( e: ChangeEvent<HTMLInputElement> ) {
		const { id, value } = e.target;
		this.setState(prev => ( { ...prev, [ id ]: value } ) )
	} 

	render() {
		return (
			<form>
				{/* используем select и footer для разделения формы: - для полей и  - для кнопок */}
				<section
					style = { sectionStyle }
				>
					{
						// Построение полей отталкивается от типа Param[]
						// значения для редактируемых полей берёт из this.state,
						// который уже готов к моменту построения дерева.
						this.props.params.map(({ id, name, type = "string" }) => {
							return (
								<Label
									id = { id }
									key = { id }
									name = { name }
								>
									{
										// Вариант для выбора с каким типом редактируемого поля нужно работать
										(
											type === "string" && (
												// работа с текстовыми полями
												<TextInput
													key = { id }
													id = { id }
													value = { this.state[ id ] }
													onHandleChange = { this.onHandleChangeTextInput }
												/>
										)
										) || (
											// вариант для масштабирования если нужно подлючить выподающий список
											type === "select" && (
												<SelectInput
													id = { id }
													handleChangeSelect = { this.onHandleChangeSelect }
													value = { this.state[ id ] }
													options = {
														this.props.model.paramValues
														.filter( it => it.paramId === id )[ 0 ].options as string[]
													}
												/>
										)
									)
								}
								</Label>
							)
						})
				}
				</section>
				<footer
					style = { footerState }
				>
					<button onClick={(e) => {
						e.preventDefault();
						console.log( this.getModel() ) 	
						alert ( JSON.stringify( this.getModel() ,null,  4 )  )
						}} > getModel</button>
				</footer>
			</form>
		)
	}
}

export default ParamEditor;
