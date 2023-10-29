// Слайдер услуг на главной странице

$('.services__slider').slick({
  centerMode: true,
  centerPadding: '0px',
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  infinite: true,
  dots: true,
  dotsClass: 'services__pagination',
  nextArrow: '.services__btn--right',
  prevArrow: '.services__btn--left',
  responsive: [
    {
      breakpoint: 991.8,
      settings: {
        arrows: true,
        centerMode: true,
        slidesToShow: 1
      }
    },
    {
      breakpoint: 480,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: '0px',
        slidesToShow: 1
      }
    }
  ]
});

// Слайдер пакетов на главной странице
function packageSlider() {
  $('.package__list').not('.slick-initialized').slick({
    centerMode: true,
    centerPadding: '0px',
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    dots: true,
    dotsClass: 'package__pagination',
    nextArrow: '.package__slide-btn--right',
    prevArrow: '.package__slide-btn--left',
    initialSlide: 1
  });
};

window.addEventListener("resize", function () {
  if (window.innerWidth < 991.8) {
    packageSlider();
  };
});

if (window.innerWidth < 991.8) {
  packageSlider();
}

// Блок пакетов услуг

let visiblePackageElements = document.querySelectorAll('.package__item-present'),
  visiblePackageButtons = document.querySelectorAll('.package__btn'),
  closePackageButtons = document.querySelectorAll('.package__close-btn'),
  unvisiblePackageElements = document.querySelectorAll('.package__item-content'),
  packageBlock = document.querySelector('.package');
if (packageBlock) {
  slickPackageSlides = packageBlock.querySelectorAll('.slick-slide');
}

visiblePackageButtons.forEach((button, index) => {
  button.addEventListener("click", (e) => {
    visiblePackageElements[index].classList.add('package__item-present--active');
    unvisiblePackageElements[index].classList.add('package__item-content--active');
  })
});

closePackageButtons.forEach((button, index) => {
  button.addEventListener("click", (e) => {
    visiblePackageElements[index].classList.remove('package__item-present--active');
    unvisiblePackageElements[index].classList.remove('package__item-content--active');
  })
});

if (window.innerWidth < 769 && packageBlock) {
  packageBlock.addEventListener("click", () => {
    slickPackageSlides.forEach((element, index) => {
      if (!element.classList.contains('slick-center')) {
        visiblePackageElements[index].classList.remove('package__item-present--active');
        unvisiblePackageElements[index].classList.remove('package__item-content--active');
      }
    });
  });
};

// Поведение кнопки меню на планшетах и телефонах

let tabletMenuButton = document.querySelector(".menu-tablet"),
  tabletMenu = document.querySelector(".menu-tablet__nav");

// (function createMenuNav() {
//   window.addEventListener("click", e => {
//     if (!tabletMenuButton.classList.contains("menu-tablet--active") && e.target.closest(".menu-tablet")) {
//       tabletMenuButton.classList.add("menu-tablet--active");
//       tabletMenu.classList.add("menu-tablet__nav--active");
//     } else if (e.target != tabletMenu && !e.target.classList.contains("menu-tablet__nav-link")) {
//       tabletMenuButton.classList.remove("menu-tablet--active");
//       tabletMenu.classList.remove("menu-tablet__nav--active");
//     }
//   });
// }());
window.addEventListener("click", e => {
  if (!tabletMenuButton.classList.contains("menu-tablet--active") && e.target.closest(".menu-tablet")) {
    tabletMenuButton.classList.add("menu-tablet--active");
    tabletMenu.classList.add("menu-tablet__nav--active");
  } else if (e.target != tabletMenu && !e.target.classList.contains("menu-tablet__nav-link")) {
    tabletMenuButton.classList.remove("menu-tablet--active");
    tabletMenu.classList.remove("menu-tablet__nav--active");
  }
});
window.addEventListener("touchstart", e => {
  if (!tabletMenuButton.classList.contains("menu-tablet--active") && e.target.closest(".menu-tablet")) {
    tabletMenuButton.classList.add("menu-tablet--active");
    tabletMenu.classList.add("menu-tablet__nav--active");
  } else if (e.target != tabletMenu && !e.target.classList.contains("menu-tablet__nav-link")) {
    tabletMenuButton.classList.remove("menu-tablet--active");
    tabletMenu.classList.remove("menu-tablet__nav--active");
  }
});

// Работа формы

let formSendedMessage = document.querySelector(".form-result--ok"),
    formNotSendedMessage = document.querySelector(".form-result--false");

function viewResultFormMessage(form) {
  let closeResultFormButton = form.querySelector(".form-result__close");
 
  closeResultFormButton.addEventListener('click', (e) => {
    form.classList.remove("active")
  })

  form.classList.add("active");


  removeResultFormMessage(form);
}

function removeResultFormMessage(form) {
  setTimeout(() => { form.classList.remove("active")}, 6000);
};

async function submitForm(event) {
  event.preventDefault(); // отключаем перезагрузку/перенаправление страницы
  try {
  	// Формируем запрос
    const response = await fetch(event.target.action, {
    	method: 'POST',
    	body: new FormData(event.target)
    });
    // проверяем, что ответ есть
    if (!response.ok) throw (`Ошибка при обращении к серверу: ${response.status}`);
    // проверяем, что ответ действительно JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw ('Ошибка обработки. Ответ не JSON');
    }
    // обрабатываем запрос
    const json = await response.json();
    if (json.result === "success") {
    	// в случае успеха
    	viewResultFormMessage(formSendedMessage);
    } else { 
    	// в случае ошибки
      viewResultFormMessage(formNotSendedMessage);
    	// console.log(json);
    	// throw (json.info);
    }
  } catch (error) { // обработка ошибки
    viewResultFormMessage(formNotSendedMessage);
    // alert(error);
  }
}

