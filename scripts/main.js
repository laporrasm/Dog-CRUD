window.addEventListener("load", () => readItems());

let crud = document.querySelector(".crud");
let pageContainer = document.querySelector(".container");

class Modal {
	constructor(
		headerText,
		body,
		confirmButtonText,
		cancelButtonText,
		acceptCallback,
		cancelCallback
	) {
		this.element = document.createElement("div");
		this.element.classList.add("modal");
		this.element.innerHTML = `
		<div class="modal__inner">
			<div class="modal__header">
				<div class="modal__title">${headerText}</div>
				<div class="modal__close-icon"><i class="fas fa-times"></i></div>
			</div>
			<div class="modal__body">
				${body}
			</div>
			<div class="modal__footer">
				<button class="modal__cancel">${cancelButtonText}</button>
				<button class="modal__confirm">${confirmButtonText}</button>
			</div>
		</div>
		`;
		this.cancel = this.element.querySelector(".modal__cancel");
		this.close = this.element.querySelector(".modal__close-icon");
		this.confirm = this.element.querySelector(".modal__confirm");

		this.addEvents(acceptCallback, cancelCallback);
	}

	addEvents(acceptCallback, cancelCallback) {
		this.cancel.addEventListener("click", () => {
			cancelCallback(this.element);
			this.closeModal();
		});

		this.close.addEventListener("click", () => this.closeModal());

		this.confirm.addEventListener("click", () => {
			acceptCallback(this.element);
			this.closeModal();
		});
	}

	closeModal() {
		this.element.remove();
	}

	openModal() {
		pageContainer.appendChild(this.element);
	}
}

function readItems() {
	for (let i = 0; i < localStorage.length; i++) {
		if (Object.keys(localStorage)[i] == "currentId") {
		} else {
			let aux = localStorage.getItem(Object.keys(localStorage)[i]);
			crud.appendChild(createListItem(JSON.parse(aux)));
		}
	}
}

function addItem(element) {
	let dog = {
		id: updateId(),
		name: element.querySelector('[name="name"]').value,
		email: element.querySelector('[name="email"]').value,
		phone: element.querySelector('[name="phone"]').value,
		location: element.querySelector('[name="location"]').value,
		hobby: element.querySelector('[name="hobby"]').value
	};
	element.querySelector("[action]").reset();
	let listItem = createListItem(dog);
	crud.appendChild(listItem);
	localStorage.setItem(`${dog.id}`, `${JSON.stringify(dog)}`);
}

function createListItem(itemObj) {
	let element = document.createElement("ul");
	element.classList.add("crud-item");
	element.innerHTML = `
		<li>${itemObj.id}</li>
		<li>${itemObj.name}</li>
		<li>${itemObj.email}</li>
		<li>${itemObj.phone}</li>
		<li>${itemObj.location}</li>
		<li>${itemObj.hobby}</li>
		<li>
			<button class="crud-item__button crud-item__button--edit">Edit</button>
			<button class="crud-item__button crud-item__button--delete">Delete</button>
		</li>
		`;

	element
		.querySelector(".crud-item__button--delete")
		.addEventListener("click", function() {
			new Modal(
				"Are you sure?",
				"Are you sure you want to delete this item?",
				"Confirm",
				"Cancel",
				() => {
					this.closest(".crud-item").remove();
					localStorage.removeItem(`${itemObj.id}`);
				},
				() => null
			).openModal();
		});

	element
		.querySelector(".crud-item__button--edit")
		.addEventListener("click", function() {
			new Modal(
				`Editing pet with ID ${itemObj.id}`,
				`<form action="">
					<label for="">Name</label>
					<input name="name" type="text" value="${itemObj.name}" required />
					<label for="">Email</label>
					<input name="email" type="email" value="${itemObj.email}" required />
					<label for="">Phone</label>
					<input name="phone" type="tel" value="${itemObj.phone}" required />
					<label for="">Location</label>
					<input name="location" type="text" value="${itemObj.location}" required />
					<label for="">Hobby</label>
					<input name="hobby" type="text" value="${itemObj.hobby}" required />
				</form>`,
				"Confirm",
				"Cancel",
				() => {
					let updatedItem = {
						id: itemObj.id,
						name: document.querySelector('[name="name"]').value,
						email: document.querySelector('[name="email"]').value,
						phone: document.querySelector('[name="phone"]').value,
						location: document.querySelector('[name="location"]').value,
						hobby: document.querySelector('[name="hobby"]').value
					};
					let newItem = createListItem(updatedItem);
					element.remove();
					crud.appendChild(newItem);

					localStorage.setItem(itemObj.id, JSON.stringify(updatedItem));
				}
			).openModal();
		});

	return element;
}

function updateId() {
	if (crud.childElementCount <= 1) localStorage.setItem("currentId", "0");
	else if (localStorage.getItem("currentId"))
		localStorage.setItem(
			"currentId",
			`${parseInt(localStorage.getItem("currentId")) + 1}`
		);
	else localStorage.setItem("currentId", "0");

	return localStorage.getItem("currentId");
}

let addDogButton = document.querySelector(".crud-header__add");
addDogButton.addEventListener("click", () =>
	new Modal(
		"Add a dog",
		`<form action="">
	<label for="">Name</label>
	<input name="name" type="text" required />
	<label for="">Email</label>
	<input name="email" type="email" required />
	<label for="">Phone</label>
	<input name="phone" type="tel" required />
	<label for="">Location</label>
	<input name="location" type="text" required />
	<label for="">Hobby</label>
	<input name="hobby" type="text" required />
</form>`,
		"Add",
		"Cancel",
		addItem,
		element => element.remove()
	).openModal()
);
