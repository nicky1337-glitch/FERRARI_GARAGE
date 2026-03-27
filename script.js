// ============================================
// FERRARI GARAGE - MAIN SCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  
  // ========== 1. ТЕМА ==========
  var themeToggle = document.getElementById('themeToggle');
  var themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
  
  if (themeToggle) {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeIcon) {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
      }
    }
    themeToggle.addEventListener('click', function() {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
      if (themeIcon) {
        themeIcon.classList.toggle('fa-moon');
        themeIcon.classList.toggle('fa-sun');
      }
    });
  }

  // ========== 2. МОБИЛЬНОЕ МЕНЮ ==========
  var navToggle = document.getElementById('navToggle');
  var navList = document.querySelector('.nav-list');
  if (navToggle && navList) {
    navToggle.addEventListener('click', function() {
      navList.classList.toggle('show');
      var icon = navToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });
  }

  // Активный пункт меню
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(function(link) {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
  
  // ========== 3. ФИЛЬТР МОДЕЛЕЙ ==========
  var filterBtns = document.querySelectorAll('.filter-btn');
  var cars = document.querySelectorAll('.car-card');
  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.dataset.filter;
      cars.forEach(function(car) {
        if (filter === 'all' || car.dataset.category === filter) {
          car.classList.remove('hidden');
          car.style.opacity = '1';
          car.style.transform = 'scale(1)';
        } else {
          car.style.opacity = '0';
          car.style.transform = 'scale(0.9)';
          setTimeout(function() { car.classList.add('hidden'); }, 300);
        }
      });
    });
  });
  
  // ========== 4. МОДАЛЬНОЕ ОКНО ==========
  var modal = document.getElementById('imageModal');
  if (modal) {
    var modalImg = document.getElementById('modalImage');
    var modalCap = document.getElementById('modalCaption');
    var closeBtn = document.getElementById('modalClose');
    
    document.querySelectorAll('.car-image img').forEach(function(img) {
      img.parentElement.addEventListener('click', function() {
        modal.style.display = 'flex';
        setTimeout(function() { modal.classList.add('show'); }, 10);
        modalImg.src = img.src;
        modalCap.textContent = img.alt;
        document.body.style.overflow = 'hidden';
      });
    });
    
    var closeModal = function() {
      modal.classList.remove('show');
      setTimeout(function() { modal.style.display = 'none'; }, 300);
      document.body.style.overflow = '';
    };
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) { if(e.target === modal) closeModal(); });
    document.addEventListener('keydown', function(e) { 
      if(e.key === 'Escape' && modal.style.display === 'flex') closeModal(); 
    });
  }
  
  // ========== 5. ФОРМА ЗАЯВКИ ==========
  var form = document.getElementById('testDriveForm');
  if (form) {
    var successMsg = document.getElementById('formSuccess');
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var valid = true;
      var name = document.getElementById('name');
      var phone = document.getElementById('phone');
      
      if (name && name.value.length < 2) {
        document.getElementById('nameError').textContent = 'Введите корректное имя';
        valid = false;
      } else { document.getElementById('nameError').textContent = ''; }
      if (phone && phone.value.length < 5) {
        document.getElementById('phoneError').textContent = 'Введите номер телефона';
        valid = false;
      } else { document.getElementById('phoneError').textContent = ''; }
      
      if (valid && successMsg) {
        form.style.display = 'none';
        successMsg.classList.add('show');
        setTimeout(function() {
          form.reset();
          form.style.display = 'block';
          successMsg.classList.remove('show');
        }, 5000);
      }
    });
  }
  
  // ========== 6. СЧЁТЧИК ПРОСМОТРОВ ==========
  var counterEl = document.getElementById('viewCounter');
  if (counterEl) {
    var views = localStorage.getItem('ferrari_views') || 0;
    views++;
    localStorage.setItem('ferrari_views', views);
    counterEl.textContent = views.toLocaleString();
  }

  // ========== 7. СРАВНЕНИЕ МОДЕЛЕЙ ==========
  var compareBtn = document.getElementById('compareBtn');
  var tableWrapper = document.getElementById('comparisonTableWrapper');
  var comparisonMessage = document.getElementById('comparisonMessage');
  
  var carData = {
    "499 LM": { name: "499 LeMans", engine: "3.0L V6", power: " 680 л.с", torque: "790 Н·м", acceleration: "2.8 сек", topspeed: "330–343 км/ч", drive: "4WD", transmission: " 7-ступенчатая секвентальная", weight: "1030 кг", fuel: "Excellium Racing 100", price: "443.245.554. руб" },
    "f40": { name: "f40", engine: "2.9L V8 Twin Turbo", power: "478 л.с", torque: "577 Н·м", acceleration: "4.1 сек", topspeed: "324 км/ч", drive: "RWD", transmission: "5-ступенчатая механическая", weight: "1100 кг", fuel: "АИ-98+", price: "246.247.300 руб" },
    "812": { name: "812 Superfast", engine: "6.5L V12", power: "789 л.с", torque: "718 Н·м", acceleration: "2.9 сек", topspeed: " 340 км/ч", drive: "RWD", transmission: "7-ступенчитая Дуал-Клатч", weight: "1,630 kg", fuel: "Высокооктановое Бензин", price: "45.000.000 руб" },
    roma: { name: "Roma", engine: "3.9L V8 Twin Turbo", power: "620 л.с", torque: "760 Н·м", acceleration: "3.4 сек", topspeed: "320 км/ч", drive: "RWD", transmission: "8-ступенчатая Дуал-Клатч", weight: "1570 кг", fuel: "Высокооктановый Бензин", price: "20.000.000 руб" },
    "296gtb": { name: "296 GTB", engine: " 3.0L V6 с двойным турбонаддувом + электромотор ", power: " 830 л.с.", torque: " 740 Н·м", acceleration: "2.9 сек", topspeed: "330 км/ч.", drive: "RWD", transmission: "8-ступенчитый робот Дуал-Клатч", weight: "1470 кг", fuel: "Выскокооктановый Бензин + Электричество", price: "30.000.000 руб" },
    "488p": { name: "488 Pista", engine: "3.9L V8 Twin Turbo", power: "720 л.с", torque: "770 Н·м", acceleration: " 2.85 сек", topspeed: "340 км/ч", drive: "RWD", transmission: "7-ступенчатый «робот» Дуал-Клатч", weight: "1280 кг", fuel: "Высокооктановый Бензин", price: "40.000.000---100.000.000 руб" },
    purosangue: { name: "Purosangue", engine: "6.5L V12", power: "725 л.с", torque: "716 Н·м", acceleration: "3.3 сек", topspeed: "310 км/ч.", drive: "4WD", transmission: "8-ступенчатый «робот»  Дуал-Клатч", weight: "2033 кг", fuel: "Высокооктановый Бензин", price: "45.000.000 руб" },
    sc05: { name: "SC05 Formula 1", engine: "3.0L V10", power: "915–940 л.с", torque: "350–370 Н·м", acceleration: "2.5 секунды", topspeed: "350 км/ч", drive: "RWD", transmission: "7-секвентальная коробка передач.", weight: "605 кг", fuel: " Спецсмесь Shell", price: "Бесценен" },
    "Daytona SP3": { name: "Daytona SP3", engine: "6.5L V12", power: "840 л.с", torque: "697 Н·м", acceleration: "2.85 сек", topspeed: "340 км/ч", drive: "RWD", transmission: "7-ступенчатый «робот» Дуал-Клатч", weight: "1485 кг", fuel: "Высокооктановый Бензин", price: "175.000.000---340.000.000 руб" },
    "812gts": { name: "812 GTS", engine: "", power: "", torque: "", acceleration: "", topspeed: "", drive: "", transmission: "", weight: "", fuel: "", price: "" },
    sf90xx: { name: "SF90 XX", engine: "", power: "", torque: "", acceleration: "", topspeed: "", drive: "", transmission: "", weight: "", fuel: "", price: "" },
    portofino: { name: "Portofino M", engine: "", power: "", torque: "", acceleration: "", topspeed: "", drive: "", transmission: "", weight: "", fuel: "", price: "" }
  };

  if (compareBtn && tableWrapper) {
    compareBtn.addEventListener('click', function() {
      var car1 = document.getElementById('car1') ? document.getElementById('car1').value : '';
      var car2 = document.getElementById('car2') ? document.getElementById('car2').value : '';
      var car3 = document.getElementById('car3') ? document.getElementById('car3').value : '';
      
      if (!car1 || !car2) {
        if (comparisonMessage) {
          comparisonMessage.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Выберите минимум 2 автомобиля';
          comparisonMessage.style.display = 'block';
          comparisonMessage.style.color = 'var(--ferrari-red, #DC0000)';
        }
        tableWrapper.style.display = 'none';
        return;
      }
      if (car1 === car2 || (car3 && (car1 === car3 || car2 === car3))) {
        if (comparisonMessage) {
          comparisonMessage.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Выберите разные автомобили';
          comparisonMessage.style.display = 'block';
          comparisonMessage.style.color = 'var(--ferrari-red, #DC0000)';
        }
        tableWrapper.style.display = 'none';
        return;
      }
      
      fillComparisonTable(car1, car2, car3);
      tableWrapper.style.display = 'block';
      if (comparisonMessage) comparisonMessage.style.display = 'none';
      
      var thirdCol = car3 ? 'table-cell' : 'none';
      document.getElementById('header-car3').style.display = thirdCol;
      ['engine','power','torque','acceleration','topspeed','drive','transmission','weight','fuel','price'].forEach(function(field) {
        var el = document.getElementById('data-car3-' + field);
        if (el) el.style.display = thirdCol;
      });
    });
  }

  function fillComparisonTable(car1, car2, car3) {
    var cars = [{key: car1, num: 1}, {key: car2, num: 2}];
    if (car3) cars.push({key: car3, num: 3});
    cars.forEach(function(item) {
      var key = item.key;
      var num = item.num;
      if (key && carData[key]) {
        var data = carData[key];
        var header = document.getElementById('header-car' + num);
        if (header) header.textContent = data.name;
        ['engine','power','torque','acceleration','topspeed','drive','transmission','weight','fuel','price'].forEach(function(field) {
          var el = document.getElementById('data-car' + num + '-' + field);
          if (el) el.textContent = data[field] || '—';
        });
      }
    });
  }

   // ========== 8. ПРОСТОЙ ЗВУК ДВИГАТЕЛЯ (исправлено) ==========
  var carSoundSelect = document.getElementById('carSoundSelect');
  var gasBtn = document.getElementById('gasBtn');
  var soundStatus = document.getElementById('soundStatus');
  
  var currentSound = null;
  var isPlaying = false;

  // Функция сброса состояния
  function resetSoundState() {
    isPlaying = false;
    if (gasBtn) {
      gasBtn.classList.remove('playing');
      gasBtn.disabled = false;
    }
    if (soundStatus) {
      soundStatus.className = 'sound-status';
      soundStatus.innerHTML = '<i class="fas fa-circle"></i> Готов к воспроизведению';
    }
  }

  // Выбор машины
  if (carSoundSelect) {
    carSoundSelect.addEventListener('change', function() {
      var selectedOption = this.options[this.selectedIndex];
      var soundPath = selectedOption.getAttribute('data-sound');
      var carName = selectedOption.textContent;
      
      // ❗ СБРАСЫВАЕМ состояние при смене машины
      if (currentSound) {
        currentSound.pause();
        currentSound.currentTime = 0;
        currentSound.onended = null; // Очищаем старый обработчик
        currentSound = null;
      }
      resetSoundState(); // Сбрасываем UI
      
      if (soundPath) {
        // Создаём новый аудио элемент
        currentSound = new Audio(soundPath);
        
        // Обновляем кнопку
        if (gasBtn) {
          gasBtn.disabled = false;
          gasBtn.innerHTML = '<i class="fas fa-volume-up"></i><span>🔊 ' + carName + '</span>';
        }
        
        // Обновляем статус
        if (soundStatus) {
          soundStatus.className = 'sound-status';
          soundStatus.innerHTML = '<i class="fas fa-circle"></i> Готов к воспроизведению';
        }
        
        // Когда звук закончится
        currentSound.onended = function() {
          resetSoundState();
        };
        
        // Если ошибка загрузки
        currentSound.onerror = function() {
          if (soundStatus) {
            soundStatus.className = 'sound-status';
            soundStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Ошибка загрузки звука';
          }
          if (gasBtn) gasBtn.disabled = true;
          isPlaying = false;
        };
      } else {
        if (gasBtn) {
          gasBtn.disabled = true;
          gasBtn.innerHTML = '<i class="fas fa-volume-up"></i><span>Нажмите для звука</span>';
        }
      }
    });
  }

  // Кнопка газа - один клик = один звук
  if (gasBtn) {
    gasBtn.addEventListener('click', function() {
      // ❗ Проверка: если уже играет или нет звука — выходим
      if (!currentSound || isPlaying) return;
      
      isPlaying = true;
      
      // Визуальный эффект
      gasBtn.classList.add('playing');
      if (soundStatus) {
        soundStatus.className = 'sound-status playing';
        soundStatus.innerHTML = '<i class="fas fa-play"></i> Воспроизведение...';
      }
      
      // Запускаем звук
      currentSound.currentTime = 0;
      currentSound.play().catch(function(err) {
        console.error('Sound play failed:', err);
        resetSoundState();
      });
    });
  }
}); // ← ЗАКРЫВАЕМ DOMContentLoaded