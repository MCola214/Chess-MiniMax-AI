class createEnum {
	constructor(enumValues) {
		// const enumObject = {};
		for (const v of enumValues) {
			this[v] = v;
		}
		Object.freeze(this);
	}
}

export default createEnum;