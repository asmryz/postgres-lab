// src/App.tsx

import React, { Fragment, useEffect, useState } from "react";
import "./App.css";

function useStickyState(defaultValue: string, key: string) {
  const [value, setValue] = React.useState(() => {
    const stickyValue = window.localStorage.getItem(key)
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue
  })
  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])
  return [value, setValue]
}


function App() {
	const [query, setQuery] = useState("SELECT * FROM jobs");
	const [result, setResult] = useState([]);
	const [schema, setSchema] = useStickyState('public', 'schema')
 
	useEffect(() => {
		fetch(`/execute/SET SCHEMA '${schema}';`).then((res) => res.json());
	}, [schema]);

	const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		if(name === "query") { setQuery(value) }
		if(name === "schema") { 
			setSchema(value) 
		} 
		//setQuery(value);
		console.log(`name : ${name},  value : ${value}`);
		// You can add logic to handle the query change here
	};

	const handleDoubleClick = async () => {
		console.log("Double clicked on the textarea");
		let response = await fetch(`/execute/${encodeURIComponent(query)}`).then((res) => res.json());
		console.log(response);
		setResult(response);
		// You can add logic to handle double click here
	};

	return (
		<>
			<div style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1000, textAlign: "left", background: "#fff" }}> 
				Schema :
				<select name="schema" value={schema} onChange={handleChange}>
					<option value="public">public</option>
					<option value="hr">hr</option>
					<option value="uni">uni</option>
				</select>
			</div>
			<div style={{  position: "fixed", top: 30, left: 0,  width: "100%", zIndex: 1000, textAlign: "left", background: "#fff" }}>
				<a
					href="#"
					onClick={handleDoubleClick}
					style={{
						display: "inline-block",
						marginBottom: "0.25rem",
						verticalAlign: "top",
						marginRight: "0.5rem",
						marginTop: "1rem"
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						xmlnsXlink="http://www.w3.org/1999/xlink"
						fill="#7d7d7d"
						height="30px"
						width="30px"
						version="1.1"
						id="Capa_1"
						viewBox="0 0 52.00 52.00"
						xmlSpace="preserve"
						stroke="#7d7d7d"
					>
						<g id="SVGRepo_iconCarrier">
							<g>
								<path d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30 c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15 C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z" />{" "}
							</g>
						</g>
					</svg>
				</a>

				<textarea
					name="query"
					rows={4}
					value={query}
					onChange={handleChange}
					onDoubleClick={handleDoubleClick}
					style={{
						top: 0,
						left: 0,
						width: "50%",
						zIndex: 1001,
						boxSizing: "border-box",
						// fontSize: "1.1rem",
						padding: "0.5rem",
					}}
				/>
			</div>

			<div style={{ marginTop: "90px", height: "calc(100vh - 80px)", overflowY: "auto", width: "4000px" }}>
				<table>
					{result.map((item: any, index: number) => (
						<Fragment key={index}>
							<thead>
								<tr>{index === 0 && Object.keys(item).map((key, idx) => <th key={idx}>{key}</th>)}</tr>
							</thead>
							<tbody>
								<tr>
									{Object.entries(item).map(([key], idx) => (
										<td key={idx}>{typeof item[key] === "object" ? item[key] : item[key].toString()}</td>
									))}
								</tr>
							</tbody>
						</Fragment>
					))}
				</table>
			</div>
		</>
	);
}

export default App;
