function StyleError (elemId) {
	Error.call (this, elemId);
	
	this.name = "StyleError";
	this.elemId = elemId;
	this.message = "Wrong style for" + this.elemId;
	
	if (Error.captureStackTrace) Error.captureStackTrace (this, this.constructor);
	else this.stack = (new Error()).stack;
};