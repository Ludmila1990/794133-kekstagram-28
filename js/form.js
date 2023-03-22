const uploadFileInput = document.querySelector('#upload-file');
const uploadSelectImageForm = document.querySelector('#upload-select-image');
const imageOverlay = document.querySelector('.img-upload__overlay');
const uploadCancel = imageOverlay.querySelector('#upload-cancel');
const body = document.querySelector('body');
const hashtagInputField = document.querySelector('.text__hashtags');
const commentInputField = document.querySelector('.text__description');


const pristine = new Pristine(uploadSelectImageForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent:'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error'
});

// Открытие окна с изображением для редактирования

const openImageEditing = () => {
  imageOverlay.classList.remove('hidden');
  body.classList.add('modal-open');

  document.addEventListener('keydown', onDocumentKeydown);
};

// Закрытие окна с изображением для редактирования

const closeImageEditing = () => {
  uploadSelectImageForm.reset();
  pristine.reset();
  imageOverlay.classList.add('hidden');
  body.classList.remove('modal-open');

  document.removeEventListener('keydown', onDocumentKeydown);
};

// Закрытие окна нажатием клавиши ESC

function onDocumentKeydown (evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();

    closeImageEditing();
  }
}

// Блокировка окна при фокусе на поле ввода хэш-тега

hashtagInputField.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
});

// Блокировка окна при фокусе на поле ввода комментария

commentInputField.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
});

// Функция, проверяющая хэш-тег

const isValidHashtag = (string) => {
  const hashtagPattern = /^#[a-zа-яё0-9]{1,19}$/i;
  return hashtagPattern.test(string);
};

// Проверка строки на наличие хэш-тегов

const checkStringValidHashtag = (string) => {
  const stringAsAnArray = string.trim().split(' ');
  return stringAsAnArray.every(isValidHashtag);
};

// Проверка строки на повторяющиеся хэш-теги

const checkStringForDublicateHashtags = (string) => {
  const stringAsAnArray = string.trim().split(' ');
  const uniqueElements = [];
  for (let i = 0; i < stringAsAnArray.length; i++) {
    if(!uniqueElements.includes(stringAsAnArray[i])) {
      uniqueElements.push(stringAsAnArray[i]);
    }
  }
  return uniqueElements.length === stringAsAnArray.length;
};

// Проверка строки на количество хэш-тегов

const checkCountHashtags = (string) => {
  if (string.length === 0) {
    return true;
  }
  const stringAsAnArray = string.trim().split(' ');
  return stringAsAnArray.length <= 5;
};

// Проверка строки на количество введенных символов

const checkCountInputChars = (string) => string.length <= 140;

pristine.addValidator(hashtagInputField, checkStringValidHashtag, 'Хэш-тег введен неверно');
pristine.addValidator(hashtagInputField, checkCountHashtags, 'Количество хэш-тегов больше 5');
pristine.addValidator(hashtagInputField, checkStringForDublicateHashtags, 'Хэш-теги повторяются');
pristine.addValidator(commentInputField, checkCountInputChars, 'Превышено количество введенных символов');

// Валидация формы

const formSubmit = (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();
  if (isValid || hashtagInputField.value === '') {
    uploadSelectImageForm.submit();
    pristine.reset();
  //closeImageEditing();
  }
};

uploadFileInput.addEventListener('change', openImageEditing);
uploadCancel.addEventListener('click', closeImageEditing);
uploadSelectImageForm.addEventListener('submit', formSubmit);
