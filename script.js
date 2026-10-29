/**
 * ═══════════════════════════════════════════════════════════════════
 * ГРУППА КОМПАНИЙ «CATRINE & AVALON-K»
 * Скрипты клиентской логики и интерактивности (Vanilla JS)
 * ═══════════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ─────────────────────────────────────────────────────────────────
     1. ФИКСИРОВАННЫЙ ХЕДЕР И СКРОЛЛ
     ───────────────────────────────────────────────────────────────── */
  const header = document.getElementById('header');
  const btnScrollTop = document.getElementById('btnScrollTop');

  const handleScroll = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Сжатие и уплотнение фона хедера при скролле > 40px
    if (header) {
      if (scrollY > 40) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    }

    // Отображение кнопки «Наверх» при скролле > 450px
    if (btnScrollTop) {
      if (scrollY > 450) {
        btnScrollTop.classList.add('btn-scroll-top--visible');
      } else {
        btnScrollTop.classList.remove('btn-scroll-top--visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Первичная проверка при загрузке

  // Клик по кнопке «Наверх»
  if (btnScrollTop) {
    btnScrollTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────────
     2. МОБИЛЬНОЕ ВЫЕЗЖАЮЩЕЕ МЕНЮ
     ───────────────────────────────────────────────────────────────── */
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuClose = document.getElementById('mobileMenuClose');
  const mobileMenuBackdrop = document.getElementById('mobileMenuBackdrop');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');

  const openMobileMenu = () => {
    if (!mobileMenu || !mobileMenuBackdrop) return;
    mobileMenu.classList.add('mobile-menu--open');
    mobileMenuBackdrop.classList.add('mobile-menu-backdrop--open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    if (burgerBtn) burgerBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('scroll-locked');
  };

  const closeMobileMenu = () => {
    if (!mobileMenu || !mobileMenuBackdrop) return;
    mobileMenu.classList.remove('mobile-menu--open');
    mobileMenuBackdrop.classList.remove('mobile-menu-backdrop--open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    if (burgerBtn) burgerBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('scroll-locked');
  };

  if (burgerBtn) burgerBtn.addEventListener('click', openMobileMenu);
  if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
  if (mobileMenuBackdrop) mobileMenuBackdrop.addEventListener('click', closeMobileMenu);

  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ─────────────────────────────────────────────────────────────────
     3. ПЕРЕХОД К ФОРМЕ И ФОКУСИРОВКА НА ПОЛЕ ИМЕНИ
     ───────────────────────────────────────────────────────────────── */
  const btnHeaderContact = document.getElementById('btnHeaderContact');
  const userNameInput = document.getElementById('userName');
  const contactsSection = document.getElementById('contacts');
  const serviceSelect = document.getElementById('serviceSelect');

  const scrollToContactsAndFocus = (preferredService = null) => {
    if (preferredService && serviceSelect) {
      serviceSelect.value = preferredService;
    }

    if (contactsSection) {
      contactsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Небольшая задержка для завершения плавного скролла
      setTimeout(() => {
        if (userNameInput) {
          userNameInput.focus();
        }
      }, 550);
    }
  };

  // Клик на кнопку «Связаться с нами» в шапке
  if (btnHeaderContact) {
    btnHeaderContact.addEventListener('click', () => {
      scrollToContactsAndFocus();
    });
  }

  // Кнопки направлений с атрибутом data-service
  const orderButtons = document.querySelectorAll('.js-order-btn');
  orderButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service');
      scrollToContactsAndFocus(service);
    });
  });

  /* ─────────────────────────────────────────────────────────────────
     4. ФИЛЬТРАЦИЯ ПОРТФОЛИО
     ───────────────────────────────────────────────────────────────── */
  const filterButtons = document.querySelectorAll('.portfolio__filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filterValue = button.getAttribute('data-filter');

      // Переключение активного класса на кнопках
      filterButtons.forEach(btn => btn.classList.remove('portfolio__filter-btn--active'));
      button.classList.add('portfolio__filter-btn--active');

      // Фильтрация элементов с анимацией появления
      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        card.classList.remove('is-animating');

        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('is-hidden');
          void card.offsetWidth; // Триггер reflow для перезапуска CSS-анимации
          card.classList.add('is-animating');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });

  /* ─────────────────────────────────────────────────────────────────
     5. МОДАЛЬНЫЙ ЛАЙТБОКС ДЛЯ ПОРТФОЛИО
     ───────────────────────────────────────────────────────────────── */
  const lightbox = document.getElementById('lightbox');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  let lastActiveElement = null;

  const openLightbox = (card) => {
    const img = card.querySelector('.portfolio-card__img');
    const title = card.querySelector('.portfolio-card__title');
    const desc = card.querySelector('.portfolio-card__desc');

    if (!lightbox || !lightboxImage || !img) return;

    lastActiveElement = document.activeElement;

    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt || '';

    if (lightboxCaption) {
      const titleText = title ? title.textContent.trim() : '';
      const descText = desc ? desc.textContent.trim() : '';
      lightboxCaption.innerHTML = `<strong>${titleText}</strong> — ${descText}`;
    }

    lightbox.classList.add('lightbox--open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('scroll-locked');

    if (lightboxClose) {
      lightboxClose.focus();
    }
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('lightbox--open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('scroll-locked');

    if (lightboxImage) {
      lightboxImage.src = '';
    }

    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  };

  portfolioCards.forEach(card => {
    // Открытие по клику мышью
    card.addEventListener('click', () => {
      openLightbox(card);
    });

    // Доступность: открытие по клавишам Enter или Пробел
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(card);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  // Закрытие по клавише Esc (для модалки и мобильного меню)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightbox && lightbox.classList.contains('lightbox--open')) {
        closeLightbox();
      }
      if (mobileMenu && mobileMenu.classList.contains('mobile-menu--open')) {
        closeMobileMenu();
      }
    }
  });

  /* ─────────────────────────────────────────────────────────────────
     6. АВТОМАСКА ТЕЛЕФОНА (+7 (XXX) XXX-XX-XX)
     ───────────────────────────────────────────────────────────────── */
  const userPhoneInput = document.getElementById('userPhone');

  if (userPhoneInput) {
    const formatPhoneNumber = (value) => {
      // Оставляем только цифры
      let numbers = value.replace(/\D/g, '');

      // Если первая цифра 8 или 7, нормализуем под код Казахстана/РФ (+7)
      if (numbers.startsWith('7') || numbers.startsWith('8')) {
        numbers = numbers.substring(1);
      }

      // Ограничиваем 10 значащими цифрами после +7
      numbers = numbers.substring(0, 10);

      let formatted = '+7';
      if (numbers.length > 0) {
        formatted += ' (' + numbers.substring(0, 3);
      }
      if (numbers.length >= 4) {
        formatted += ') ' + numbers.substring(3, 6);
      }
      if (numbers.length >= 7) {
        formatted += '-' + numbers.substring(6, 8);
      }
      if (numbers.length >= 9) {
        formatted += '-' + numbers.substring(8, 10);
      }

      return formatted;
    };

    userPhoneInput.addEventListener('input', (e) => {
      const input = e.target;
      const originalValue = input.value;

      // Если поле пустое, ничего не навязываем
      if (!originalValue) return;

      input.value = formatPhoneNumber(originalValue);
    });

    userPhoneInput.addEventListener('focus', () => {
      if (!userPhoneInput.value) {
        userPhoneInput.value = '+7 (';
      }
    });

    userPhoneInput.addEventListener('blur', () => {
      if (userPhoneInput.value === '+7 (' || userPhoneInput.value === '+7') {
        userPhoneInput.value = '';
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────────
     7. ВАЛИДАЦИЯ И ОБРАБОТКА ФОРМЫ ЗАЯВКИ
     ───────────────────────────────────────────────────────────────── */
  const leadForm = document.getElementById('leadForm');
  const formSuccess = document.getElementById('formSuccess');
  const btnResetForm = document.getElementById('btnResetForm');
  const btnSubmitForm = document.getElementById('btnSubmitForm');

  const groupName = document.getElementById('groupName');
  const groupPhone = document.getElementById('groupPhone');
  const errorName = document.getElementById('errorName');
  const errorPhone = document.getElementById('errorPhone');
  const userConsent = document.getElementById('userConsent');
  const errorConsent = document.getElementById('errorConsent');

  const clearFieldError = (group, errorElement) => {
    if (group) group.classList.remove('has-error');
    if (errorElement) errorElement.textContent = '';
  };

  const setFieldError = (group, errorElement, message) => {
    if (group) group.classList.add('has-error');
    if (errorElement) errorElement.textContent = message;
  };

  // Очистка ошибок при вводе
  if (userNameInput) {
    userNameInput.addEventListener('input', () => {
      clearFieldError(groupName, errorName);
    });
  }

  if (userPhoneInput) {
    userPhoneInput.addEventListener('input', () => {
      clearFieldError(groupPhone, errorPhone);
    });
  }

  if (userConsent) {
    userConsent.addEventListener('change', () => {
      if (errorConsent) errorConsent.textContent = '';
    });
  }

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Валидация имени
      const nameVal = userNameInput ? userNameInput.value.trim() : '';
      if (!nameVal || nameVal.length < 2) {
        setFieldError(groupName, errorName, 'Пожалуйста, укажите ваше имя или название компании');
        isValid = false;
      } else {
        clearFieldError(groupName, errorName);
      }

      // Валидация телефона (требуется не менее 10 цифр номера)
      const phoneDigits = userPhoneInput ? userPhoneInput.value.replace(/\D/g, '') : '';
      // +7 плюс 10 цифр = 11 цифр всего
      if (phoneDigits.length < 11) {
        setFieldError(groupPhone, errorPhone, 'Введите корректный номер телефона (не менее 10 цифр)');
        isValid = false;
      } else {
        clearFieldError(groupPhone, errorPhone);
      }

      // Валидация согласия на обработку данных
      if (userConsent && !userConsent.checked) {
        if (errorConsent) errorConsent.textContent = 'Требуется согласие на обработку персональных данных';
        isValid = false;
      }

      if (!isValid) return;

      // Имитация отправки данных
      const submitTextElement = btnSubmitForm.querySelector('.btn__text');
      const originalSubmitText = submitTextElement ? submitTextElement.textContent : 'Отправить заявку';

      btnSubmitForm.disabled = true;
      if (submitTextElement) {
        submitTextElement.textContent = 'Отправка данных...';
      }

      setTimeout(() => {
        leadForm.style.display = 'none';
        if (formSuccess) {
          formSuccess.classList.add('form-success--active');
        }
        btnSubmitForm.disabled = false;
        if (submitTextElement) {
          submitTextElement.textContent = originalSubmitText;
        }
      }, 700);
    });
  }

  // Кнопка «Отправить еще одну заявку»
  if (btnResetForm) {
    btnResetForm.addEventListener('click', () => {
      if (leadForm) {
        leadForm.reset();
        clearFieldError(groupName, errorName);
        clearFieldError(groupPhone, errorPhone);
        if (errorConsent) errorConsent.textContent = '';
        leadForm.style.display = 'flex';
      }
      if (formSuccess) {
        formSuccess.classList.remove('form-success--active');
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────────
     8. ПЛАВНОЕ ПОЯВЛЕНИЕ ПРИ СКРОЛЛЕ (INTERSECTION OBSERVER)
     ───────────────────────────────────────────────────────────────── */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Фолбэк для браузеров без IntersectionObserver
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  /* ─────────────────────────────────────────────────────────────────
     9. ИИ-КОНСУЛЬТАНТ «КАТРИН» (ИНТЕЛЛЕКТУАЛЬНЫЙ АГЕНТ)
     Построен на базе знаний CJM, регламента и Tone of Voice фабрики
     ───────────────────────────────────────────────────────────────── */
  const katrinWidget = document.getElementById('katrinWidget');
  const katrinTrigger = document.getElementById('katrinTrigger');
  const katrinChat = document.getElementById('katrinChat');
  const katrinCloseBtn = document.getElementById('katrinCloseBtn');
  const katrinResetBtn = document.getElementById('katrinResetBtn');
  const katrinMessages = document.getElementById('katrinMessages');
  const katrinChatBody = document.getElementById('katrinChatBody');
  const katrinTyping = document.getElementById('katrinTyping');
  const katrinChips = document.getElementById('katrinChips');
  const katrinForm = document.getElementById('katrinForm');
  const katrinInput = document.getElementById('katrinInput');

  let isKatrinInitialized = false;

  // Форматирование текущего времени (HH:MM)
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  // Прокрутка чата вниз к последнему сообщению
  const scrollChatToBottom = () => {
    if (katrinChatBody) {
      setTimeout(() => {
        katrinChatBody.scrollTo({
          top: katrinChatBody.scrollHeight,
          behavior: 'smooth'
        });
      }, 50);
    }
  };

  // Добавление сообщения в окно чата
  const appendMessage = (text, sender = 'bot', actions = null) => {
    if (!katrinMessages) return;

    const msgEl = document.createElement('div');
    msgEl.className = `katrin-msg katrin-msg--${sender}`;

    const bubbleEl = document.createElement('div');
    bubbleEl.className = 'katrin-msg__bubble';
    bubbleEl.innerHTML = text;

    if (actions && Array.isArray(actions) && actions.length > 0) {
      const actionsContainer = document.createElement('div');
      actionsContainer.className = 'katrin-msg__actions';

      actions.forEach(action => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `katrin-msg__action-btn katrin-msg__action-btn--${action.type || 'primary'}`;
        btn.textContent = action.label;
        btn.addEventListener('click', () => {
          if (action.handler) {
            action.handler();
          }
        });
        actionsContainer.appendChild(btn);
      });

      bubbleEl.appendChild(actionsContainer);
    }

    const timeEl = document.createElement('span');
    timeEl.className = 'katrin-msg__time';
    timeEl.textContent = getCurrentTime();

    msgEl.appendChild(bubbleEl);
    msgEl.appendChild(timeEl);

    katrinMessages.appendChild(msgEl);
    scrollChatToBottom();
  };

  // Индикатор набора сообщения
  const setTyping = (isTyping) => {
    if (!katrinTyping) return;
    if (isTyping) {
      katrinTyping.classList.add('katrin-typing--active');
      scrollChatToBottom();
    } else {
      katrinTyping.classList.remove('katrin-typing--active');
    }
  };

  // База знаний Катрин: генерация экспертного ответа
  const generateKatrinResponse = (userText) => {
    const q = userText.toLowerCase();

    // 1. Страх: подведут, предоплата, обман, бросят, гарантии
    if (q.includes('гарант') || q.includes('подвед') || q.includes('предоплат') || q.includes('обман') || q.includes('страх') || q.includes('надежн') || q.includes('почему вы')) {
      return {
        text: `Мы прекрасно понимаем Ваши чувства: многих наших клиентов в прошлом уже подводили сторонние мебельщики, когда брали предоплату и затягивали работу. С нами этот риск исключен:
<br><br>
• <strong>20+ лет на рынке Казахстана</strong> и более 5 100 реализованных объектов.<br>
• <strong>Собственная фабрика 6 000 м²</strong> и 135 ведущих специалистов (мы прямой производитель полного цикла, а не перекупщики).<br>
• <strong>Официальный договор</strong> с прозрачными этапами и международным стандартом ISO.<br>
• <strong>Персональная ответственность:</strong> один менеджер-дизайнер ведет Ваш заказ от первого эскиза до подписания Акта выполненных работ.<br>
• <strong>ОТК и контрольная сборка:</strong> каждое изделие обязательно предварительно собирается в цехе до вывоза к Вам домой.`,
        actions: [
          {
            label: 'Заказать предварительный расчет',
            type: 'primary',
            handler: () => {
              toggleKatrinChat(false);
              scrollToContactsAndFocus('individual');
            }
          },
          {
            label: 'Написать нам в WhatsApp',
            type: 'whatsapp',
            handler: () => {
              window.open('https://wa.me/77710333366?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%A5%D0%BE%D1%87%D1%83%20%D1%83%D1%82%D0%BE%D1%87%D0%BD%D0%B8%D1%82%D1%8C%20%D0%B3%D0%B0%D1%80%D0%B0%D0%BD%D1%82%D0%B8%D0%B8%20%D0%B8%20%D1%83%D1%81%D0%BB%D0%BE%D0%B2%D0%B8%D1%8F%20%D0%B4%D0%BE%D0%B3%D0%BE%D0%B2%D0%BE%D1%80%D0%B0', '_blank', 'noopener,noreferrer');
            }
          }
        ]
      };
    }

    // 2. Регламент, этапы, путь заказа, замер
    if (q.includes('этап') || q.includes('заказ') || q.includes('регламент') || q.includes('замер') || q.includes('процесс') || q.includes('как работаете') || q.includes('кп')) {
      return {
        text: `Каждый шаг реализации Вашей мебели строго регламентирован:
<br><br>
1. <strong>Первый контакт:</strong> в день заявки за Вами закрепляется персональный менеджер-дизайнер.<br>
2. <strong>КП и расчет:</strong> готовим предложение за 1–3 рабочих дня, желательно в 3 вариантах цен под разный бюджет.<br>
3. <strong>Договор и оплата:</strong> согласовываем стоимость и защищаем Ваши интересы договором.<br>
4. <strong>Шоурум:</strong> Вы лично выбираете шпон, краску, ЛДСП и ручки. Каждый образец фиксируется письменно!<br>
5. <strong>Контрольный замер:</strong> выезд технолога до 3 рабочих дней (проверка коммуникаций, розеток, радиаторов).<br>
6. <strong>Производство:</strong> подготовка техдокументации (7–10 дней), компьютерный раскрой и контрольная сборка ОТК.<br>
7. <strong>Монтаж и АВР:</strong> установка мебели штатной бригадой и подписание акта сдачи.`,
        actions: [
          {
            label: 'Вызвать технолога на замер',
            type: 'primary',
            handler: () => {
              toggleKatrinChat(false);
              scrollToContactsAndFocus('individual');
            }
          }
        ]
      };
    }

    // 3. Оттенки, цвета, покраска, образцы, материалы
    if (q.includes('оттен') || q.includes('цвет') || q.includes('краск') || q.includes('образ') || q.includes('шпон') || q.includes('палитр') || q.includes('выкрас') || q.includes('материал')) {
      return {
        text: `Сомнения в оттенках — это самый частый вопрос, и мы относимся к нему с максимальной чуткостью. Цвет на экране или в каталоге всегда отличается от освещения в Вашей комнате.
<br><br>
Поэтому в CATRINE действует строгое правило: <strong>никаких устных согласований оттенков!</strong>
<br><br>
Мы приглашаем Вас в наш флагманский салон (ул. Ташенова, 19). Здесь Вы сможете вживую оценить реальные выкрасы эмалей, фактуры натурального шпона ясеня и дуба, кварцевого агломерата и итальянских тканей. Каждый утвержденный Вами образец фиксируется письменно в паспорте заказа.`,
        actions: [
          {
            label: 'Записаться на встречу в шоуруме',
            type: 'primary',
            handler: () => {
              toggleKatrinChat(false);
              scrollToContactsAndFocus('individual');
            }
          }
        ]
      };
    }

    // 4. Фурнитура, Hettich, петли, ящики
    if (q.includes('hettich') || q.includes('хети') || q.includes('хеттих') || q.includes('фурнитур') || q.includes('петл') || q.includes('доводчик') || q.includes('ящик')) {
      return {
        text: `Фабрика CATRINE является <strong>официальным дистрибьютором немецкой премиальной фурнитуры Hettich</strong> в Казахстане.
<br><br>
• Петли <strong>Sensys</strong> со встроенным демпфированием для идеальной тишины.<br>
• Направляющие скрытого монтажа <strong>Quadro</strong> и <strong>Actro 5D</strong> с идеальной геометрией выдвижения.<br>
• Тонкостенные премиальные ящики <strong>AvanTech You</strong>.<br>
• Немецкий ресурс фурнитуры рассчитан на десятилетия ежедневного комфортного использования.`,
        actions: [
          {
            label: 'Посмотреть образцы фурнитуры',
            type: 'primary',
            handler: () => {
              toggleKatrinChat(false);
              scrollToContactsAndFocus('hettich');
            }
          }
        ]
      };
    }

    // 5. Сроки, перенос, производство, почему долго
    if (q.includes('срок') || q.includes('перенос') || q.includes('задержк') || q.includes('быстро') || q.includes('долго') || q.includes('когда')) {
      return {
        text: `Индивидуальная премиальная мебель создается мастерами буквально своими руками. Дом построить иногда проще, чем учесть все миллиметровые тонкости авторского интерьера.
<br><br>
Мы никогда не гонимся за спешкой в ущерб качеству. Перед отправкой к Вам мебель проходит контрольную сборку и проверку ОТК в цехе. Мы делаем мебель Вашей мечты, которой Вы будете искренне гордиться каждый день. Стандартный производственный цикл после контрольного замера согласовывается индивидуально в договоре.`,
        actions: [
          {
            label: 'Уточнить сроки моего объекта',
            type: 'whatsapp',
            handler: () => {
              window.open('https://wa.me/77710333366?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%A5%D0%BE%D1%87%D1%83%20%D1%83%D1%82%D0%BE%D1%87%D0%BD%D0%B8%D1%82%D1%8C%20%D1%81%D1%80%D0%BE%D0%BA%D0%B8%20%D0%BF%D1%80%D0%BE%D0%B8%D0%B7%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D0%B4%D0%BB%D1%8F%20%D0%BC%D0%BE%D0%B5%D0%B3%D0%BE%20%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B0', '_blank', 'noopener,noreferrer');
            }
          }
        ]
      };
    }

    // 6. Шоурум, адрес, где находитесь, контакты, время
    if (q.includes('шоурум') || q.includes('адрес') || q.includes('где') || q.includes('находит') || q.includes('ташенов') || q.includes('приехать') || q.includes('время') || q.includes('режим') || q.includes('телефон')) {
      return {
        text: `Будем рады видеть Вас в нашем новом представительском салоне:
<br><br>
📍 <strong>г. Астана, ул. Ташенова, 19</strong> (флагманский шоурум CATRINE & AVALON-K).<br>
🕒 <strong>Режим работы:</strong> ежедневно с 09:00 до 20:00.<br>
📞 <strong>Телефон:</strong> +7 (771) 033-33-66.<br>
<br>
В шоуруме представлены готовые интерьерные зоны кухонь, гардеробных, стенды немецкой фурнитуры Hettich, образцы шпона, камня и штор. Вы можете приехать лично или со своим дизайнером интерьера.`,
        actions: [
          {
            label: 'Позвонить в шоурум',
            type: 'primary',
            handler: () => {
              window.location.href = 'tel:+77710333366';
            }
          }
        ]
      };
    }

    // 7. Кухни, гардеробные, шкафы
    if (q.includes('кухн') || q.includes('гардероб') || q.includes('шкаф') || q.includes('спальн') || q.includes('ванн') || q.includes('панел')) {
      return {
        text: `Проектирование авторских кухонь и гардеробных зон — ключевая специализация направления <strong>CATRINE Individual</strong>:
<br><br>
• Индивидуальная архитектура под планировку Вашего дома без стандартных модульных ограничений.<br>
• Фасады из натурального шпона, эмали глубокого матирования, тонированного стекла в тонком алюминиевом профиле.<br>
• Встроенная теплая подсветка полок и ящиков.<br>
• Столешницы из натурального и кварцевого камня.<br>
• Немецкая фурнитура Hettich с пожизненной гарантией.`,
        actions: [
          {
            label: 'Заказать проект кухни/гардеробной',
            type: 'primary',
            handler: () => {
              toggleKatrinChat(false);
              scrollToContactsAndFocus('individual');
            }
          }
        ]
      };
    }

    // 8. B2B, Avalon-K, тендеры, коммерческие объекты, девелоперы
    if (q.includes('b2b') || q.includes('авалон') || q.includes('avalon') || q.includes('тендер') || q.includes('офис') || q.includes('отел') || q.includes('банк') || q.includes('bi group')) {
      return {
        text: `Корпоративное крыло <strong>AVALON-K</strong> специализируется на оснащении коммерческих и общественных пространств:
<br><br>
• Опыт реализации знаковых объектов Казахстана: EXPO, Abu Dhabi Plaza, Hilton Astana, ForteBank, Halyk Bank, Министерство обороны РК.<br>
• Серийное и контрактное производство мебели и акустических стеновых панелей для девелоперов (BI Group), театров, отелей и конференц-залов.<br>
• Полное соответствие требованиям проектно-сметной документации и строгим срокам сдачи.`,
        actions: [
          {
            label: 'Обсудить B2B тендер',
            type: 'primary',
            handler: () => {
              toggleKatrinChat(false);
              scrollToContactsAndFocus('avalon');
            }
          }
        ]
      };
    }

    // 9. Текстиль, шторы, карнизы
    if (q.includes('текстил') || q.includes('штор') || q.includes('портьер') || q.includes('карниз') || q.includes('жалюзи') || q.includes('блэкаут')) {
      return {
        text: `Салон <strong>CATRINE Textile</strong> реализует комплексный текстильный декор премиум-класса:
<br><br>
• Эксклюзивные коллекции тканей из Европы, Турции, Индии и Китая.<br>
• Негорючие блэкаут-портьеры для отелей и частных спален.<br>
• Моторизованные электрокарнизы с интеграцией в систему «Умный дом».<br>
• Полный цикл: выезд дизайнера с каталогами тканей, пошив и профессиональная навеска.`,
        actions: [
          {
            label: 'Выбрать текстиль',
            type: 'primary',
            handler: () => {
              toggleKatrinChat(false);
              scrollToContactsAndFocus('textile');
            }
          }
        ]
      };
    }

    // 10. Модульные системы
    if (q.includes('модул') || q.includes('серийн') || q.includes('готов')) {
      return {
        text: `Направление <strong>CATRINE Modul</strong> — это серийная модульная мебель фабричного качества:
<br><br>
• Модульные гардеробные системы, шкафы и современные прихожие зоны.<br>
• Изготовление напрямую на фабрике без посреднических наценок.<br>
• Оптимальный баланс практичности, эстетики и долговечности.<br>
• Короткие сроки поставки благодаря стандартизированным базовым блокам.`,
        actions: [
          {
            label: 'Подобрать модульную систему',
            type: 'primary',
            handler: () => {
              toggleKatrinChat(false);
              scrollToContactsAndFocus('modul');
            }
          }
        ]
      };
    }

    // 11. Цена, стоимость, сколько стоит, прайс
    if (q.includes('цен') || q.includes('стоимост') || q.includes('прайс') || q.includes('сколько') || q.includes('расчет') || q.includes('смет')) {
      return {
        text: `Стоимость каждого изделия в CATRINE Individual рассчитывается индивидуально исходя из Ваших размеров, выбранных материалов (натуральный шпон, эмаль, кварцевый камень) и наполнения Hettich.
<br><br>
Мы готовим коммерческое предложение за <strong>1–3 рабочих дня</strong> и формируем <strong>3 ценовых варианта</strong>, чтобы Вы могли выбрать самое комфортное решение без переплат.
<br><br>
Вы можете прикрепить чертеж или визуализацию в форме на сайте, либо отправить ее нам напрямую в WhatsApp.`,
        actions: [
          {
            label: 'Заполнить форму для сметы',
            type: 'primary',
            handler: () => {
              toggleKatrinChat(false);
              scrollToContactsAndFocus('individual');
            }
          },
          {
            label: 'Отправить проект в WhatsApp',
            type: 'whatsapp',
            handler: () => {
              window.open('https://wa.me/77710333366?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%A5%D0%BE%D1%87%D1%83%20%D0%BE%D1%82%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D1%8C%20%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%20%D0%BD%D0%B0%20%D1%80%D0%B0%D1%81%D1%87%D0%B5%D1%82%20%D1%81%D1%82%D0%BE%D0%B8%D0%BC%D0%BE%D1%81%D1%82%D0%B8', '_blank', 'noopener,noreferrer');
            }
          }
        ]
      };
    }

    // Базовый ответ эксперта
    return {
      text: `Благодарю за вопрос! Как персональный консультант фабрики CATRINE, я с радостью помогу Вам сориентироваться во всех тонкостях: от выбора материалов и фурнитуры Hettich до вызова технолога на замер.
<br><br>
Вы можете задать конкретный вопрос о производстве, сроках, гарантиях или оставить заявку на подготовку сметы.`,
      actions: [
        {
          label: 'Оставить заявку на расчет',
          type: 'primary',
          handler: () => {
            toggleKatrinChat(false);
            scrollToContactsAndFocus('individual');
          }
        },
        {
          label: 'Задать вопрос в WhatsApp',
          type: 'whatsapp',
          handler: () => {
            window.open('https://wa.me/77710333366?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%A5%D0%BE%D1%87%D1%83%20%D0%BF%D0%BE%D0%BB%D1%83%D1%87%D0%B8%D1%82%D1%8C%20%D0%BA%D0%BE%D0%BD%D1%81%D1%83%D0%BB%D1%8C%D1%82%D0%B0%D1%86%D0%B8%D1%8E%20%D0%BF%D0%BE%20%D0%BC%D0%B5%D0%B1%D0%B5%D0%BB%D0%B8', '_blank', 'noopener,noreferrer');
          }
        }
      ]
    };
  };

  // Первичное приветствие Катрин
  const initKatrinGreeting = () => {
    if (!katrinMessages) return;
    katrinMessages.innerHTML = '';

    const greetingText = `Здравствуйте! Меня зовут <strong>Катрин</strong>. Я персональный консультант фабрики <strong>CATRINE & AVALON-K</strong>.
<br><br>
Спокойно доверьте нам заботу о Вашем доме: мы создаем уют, которым Вы будете искренне гордиться. Я готова рассказать о нашем производстве 6 000 м², регламенте работы от первого эскиза до монтажа, немецкой фурнитуре Hettich или помочь рассчитать проект.
<br><br>
О чем Вам рассказать подробнее? Выберите вопрос ниже или напишите своими словами:`;

    appendMessage(greetingText, 'bot');
  };

  // Переключение состояния чата Катрин (открыть/закрыть)
  const toggleKatrinChat = (forceState = null) => {
    if (!katrinChat || !katrinTrigger) return;

    const isOpen = katrinChat.classList.contains('katrin-chat--open');
    const targetState = forceState !== null ? forceState : !isOpen;

    if (targetState) {
      katrinChat.classList.add('katrin-chat--open');
      katrinChat.setAttribute('aria-hidden', 'false');
      katrinTrigger.setAttribute('aria-expanded', 'true');

      if (!isKatrinInitialized) {
        initKatrinGreeting();
        isKatrinInitialized = true;
      }

      setTimeout(() => {
        if (katrinInput) katrinInput.focus();
      }, 300);
    } else {
      katrinChat.classList.remove('katrin-chat--open');
      katrinChat.setAttribute('aria-hidden', 'true');
      katrinTrigger.setAttribute('aria-expanded', 'false');
    }
  };

  if (katrinTrigger) {
    katrinTrigger.addEventListener('click', () => toggleKatrinChat());
  }

  if (katrinCloseBtn) {
    katrinCloseBtn.addEventListener('click', () => toggleKatrinChat(false));
  }

  if (katrinResetBtn) {
    katrinResetBtn.addEventListener('click', () => {
      initKatrinGreeting();
    });
  }

  // Обработка кликов по быстрым чипсам
  const chipButtons = document.querySelectorAll('.katrin-chip');
  chipButtons.forEach(chip => {
    chip.addEventListener('click', () => {
      const question = chip.getAttribute('data-question') || chip.textContent.trim();
      handleUserQuestion(question);
    });
  });

  // Отправка вопроса пользователя
  const handleUserQuestion = (text) => {
    if (!text || !text.trim()) return;
    const cleanText = text.trim();

    // 1. Показываем вопрос пользователя
    appendMessage(cleanText, 'user');
    if (katrinInput) katrinInput.value = '';

    // 2. Включаем имитацию набора
    setTyping(true);

    // 3. Задержка для реалистичности ИИ-диалога (600–900мс)
    setTimeout(() => {
      setTyping(false);
      const answer = generateKatrinResponse(cleanText);
      appendMessage(answer.text, 'bot', answer.actions);
    }, 750);
  };

  if (katrinForm) {
    katrinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (katrinInput) {
        handleUserQuestion(katrinInput.value);
      }
    });
  }
});


