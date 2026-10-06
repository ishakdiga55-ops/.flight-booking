const form = document.getElementById('bookingForm');
const results = document.getElementById('results');
const flightsList = document.getElementById('flightsList');

const airlines = ['الخطوط الجوية الجزائرية', 'طيران الإمارات', 'الخطوط السعودية', 'القطرية', 'الاتحاد للطيران'];
const prices = [25000, 45000, 38000, 52000, 41000];

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const from = document.getElementById('from').value.trim();
  const to = document.getElementById('to').value.trim();
  const depart = document.getElementById('depart').value;
  const passengers = parseInt(document.getElementById('passengers').value);
  const travelClass = document.getElementById('class').value;

  const numFlights = 3;
  let html = '';

  for (let i = 0; i < numFlights; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const basePrice = prices[Math.floor(Math.random() * prices.length)];
    const classMultiplier = travelClass === 'business' ? 2.5 : travelClass === 'first' ? 4 : 1;
    const totalPrice = Math.round(basePrice * classMultiplier * passengers);
    const flightNumber = 'FL' + Math.floor(100 + Math.random() * 900);
    const time = `${String(6 + i * 2).padStart(2, '0')}:00`;

    // هنا يتم إضافة زر "احجز الآن"
    html += `
      <div class="flight-card">
        <div class="flight-info">
          <h3>${airline} - ${flightNumber}</h3>
          <p>${from} ✈ ${to} | ${depart} | ${time}</p>
          <p>${passengers} مسافر - ${travelClass === 'economy' ? 'اقتصادية' : travelClass === 'business' ? 'رجال الأعمال' : 'أولى'}</p>
        </div>
        <div>
          <div class="flight-price">${totalPrice.toLocaleString()} دج</div>
          <button onclick="bookFlight('${airline}', '${flightNumber}', '${from}', '${to}', '${depart}', ${passengers}, '${travelClass}', ${totalPrice})">احجز الآن</button>
        </div>
      </div>
    `;
  }

  flightsList.innerHTML = html;
  results.classList.remove('hidden');
});

// دالة الحجز في Firebase
window.bookFlight = async function(airline, flightNumber, from, to, depart, passengers, travelClass, totalPrice) {
  try {
    const docRef = await window.addDoc(window.collection(window.db, "bookings"), {
      airline: airline,
      flightNumber: flightNumber,
      from: from,
      to: to,
      depart: depart,
      passengers: passengers,
      travelClass: travelClass,
      totalPrice: totalPrice,
      bookingDate: new Date().toISOString()
    });
    alert(`✅ تم الحجز بنجاح!\nرقم الحجز: ${docRef.id}`);
  } catch (e) {
    console.error("Error adding document: ", e);
    alert("❌ حدث خطأ أثناء الحجز. تأكد من إعدادات Firebase.");
  }
};
