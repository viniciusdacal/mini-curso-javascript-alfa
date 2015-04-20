var Contacts = (function () {
	var listEl;
	var listItemEl;
	var contactCollection = [];

	var init = function (selector) {
		listEl = document.querySelector(selector);
		listItemEl = listEl.querySelector('.list-item');
		formEl = listEl.querySelector('.form-item');

		listEl.removeChild(listItemEl);
		listEl.removeChild(formEl);

		loadContacts();
	};

	var loadContacts = function () {
		var filePath = 'contactCollection.json';
		XHR.get(filePath, function (data) {
			contactCollection = JSON.parse(data);
			listContacts();
		});
	};

	var listContacts = function (collection) {
		_cleanList();
		var collection = collection || contactCollection;
		var listItem = [];

		var docFragment = document.createDocumentFragment();
		collection.forEach(function (item, i) {
			var scope = {'contact':item};
			var item = TemplateRender.render(listItemEl, scope);
			item.addEventListener('click', _onclickCallback);
			docFragment.appendChild(item);
			listItem.push(item);
		});

		listEl.appendChild(docFragment);
	};

	var addContact = function () {
		contactCollection.unshift(newContact());
		var item = _loadContactTemplate(0, formEl);
		item.addEventListener('click', _onclickCallback);
		listEl.insertBefore(item, listEl.firstChild);
	};

	var removeContact = function (i) {
		contactCollection.splice(i, 1);
		listContacts();
	};

	var updateContact = function (i, updatedContact) {
		contactCollection[i] = updatedContact;

		var item = _loadContactTemplate(i, listItemEl);
		var currentItem = listEl.childNodes[i];

		item.addEventListener('click', _onclickCallback);
		listEl.replaceChild(item, currentItem);
	};

	var editContact = function (i) {
		var item = _loadContactTemplate(i, formEl);
		var currentItem = listEl.childNodes[i];

		item.addEventListener('click', _onclickCallback);
		listEl.replaceChild(item, currentItem);
	};

	var newContact = function () {
		return {name:'', phone: '', email: ''};
	};

	var addContactButton = function (selector) {
		var addButton = document.querySelector(selector);
		addButton.addEventListener('click', function () {
			return addContact();
		});
	};

	var _loadContactTemplate = function (i, template) {
		var contact = contactCollection[i];
		var scope = {'contact':contact};
		var item = TemplateRender.render(template, scope);
		return item;
	};

	var _findButton = function (e, target) {
		while(target.nodeName !== 'A' && target !== e.currentTarget) {
			target = target.parentNode;
		}
		return target.nodeName === 'A'? target :false;
	};

	var _findNodeIndex = function (el, children) {
		return Array.prototype.indexOf.call(children, el);
	};

	var _cleanList = function () {
		while(listEl.firstChild) {
			listEl.removeChild(listEl.firstChild);
		}
	};

	var _callbackList = {
		edit: function (listItem) {
			var index = _findNodeIndex(listItem, listEl.childNodes);
			editContact(index);
		},
		remove: function (listItem) {
			var index = _findNodeIndex(listItem, listEl.childNodes);
			removeContact(index);
		},
		canceledit: function (listItem) {
			var index = _findNodeIndex(listItem, listEl.childNodes);
			var item = _loadContactTemplate(index, listItemEl);
			var currentItem = listEl.childNodes[index];

			item.addEventListener('click', _onclickCallback);
			listEl.replaceChild(item, currentItem);
		},
		update: function (listItem) {
			var index = _findNodeIndex(listItem, listEl.childNodes);
			var listModels = listItem.querySelectorAll('input[data-model]');
			var scope = {};
			listModels.forEach(function (item, i) {
				if(item.dataset && item.dataset.hasOwnProperty('model')) {
					scope[item.dataset.model] = item.value;
				}
			});

			updateContact(index, scope);
		}
	};

	var _onclickCallback = function (e) {
		var target = e.target;
		var button = _findButton(e, target);
		if(button) {
			e.preventDefault();
		}

		_callbackList.forEach(function (callback, i) {
			if(button.dataset &&
			   button.dataset.hasOwnProperty(i)) {
				callback(e.currentTarget);
			}
		});
	};

	return {
		init: init,
		loadContacts: loadContacts,
		addContactButton: addContactButton,
		add: addContact,
		edit: editContact,
		remove: removeContact
	};

}());