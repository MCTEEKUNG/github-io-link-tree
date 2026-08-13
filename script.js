(() => {
  const flowDetails = {
    era5: {
      kicker: "01 / DATA INPUT",
      title: "ERA5 · สภาพอากาศย้อนหลัง 30 ปี",
      copy: "ฐานข้อมูลภูมิอากาศหลักสำหรับสร้างสัญญาณความเสี่ยงคลื่นความร้อนระดับจังหวัด",
      bullets: ["ช่วงข้อมูล 1994–2023", "เชื่อมตัวแปรอุณหภูมิและ soil moisture", "นำไปตรวจสอบร่วมกับเวลาและพื้นที่ 77 จังหวัด"]
    },
    mjo: {
      kicker: "02 / DATA INPUT",
      title: "MJO · สัญญาณการแปรปรวนในเขตร้อน",
      copy: "ใช้ phase และ amplitude ของ MJO เพื่อเติมบริบทสภาพอากาศระยะ sub-seasonal",
      bullets: ["อ่านสัญญาณตาม phase ของ MJO", "ใช้ร่วมกับข้อมูลภูมิอากาศย้อนหลัง", "ไม่ใช้สัญญาณเดี่ยวตัดสินความเสี่ยง"]
    },
    nino: {
      kicker: "03 / DATA INPUT",
      title: "Niño3.4 · บริบท ENSO",
      copy: "ตัวแปรภูมิอากาศมหภาคที่ช่วยอธิบายบริบทของความแปรปรวนอุณหภูมิในภูมิภาค",
      bullets: ["สะท้อนบริบท El Niño / La Niña", "นำเข้าสู่ feature set ของโมเดล", "ตรวจความสัมพันธ์ร่วมกับตัวแปรอื่นใน EDA"]
    },
    space: {
      kicker: "04 / DATA INPUT",
      title: "Time + location · เวลาและพื้นที่",
      copy: "จัดข้อมูลตามเวลาและจังหวัด เพื่อให้ผลลัพธ์ตีความได้ในระดับพื้นที่จริง",
      bullets: ["ครอบคลุม 77 จังหวัด", "เก็บฤดูกาลและตำแหน่งของเหตุการณ์", "ทำให้ผลลัพธ์เป็นความน่าจะเป็นรายจังหวัด"]
    },
    eda: {
      kicker: "01 / QUALITY CHECK",
      title: "EDA + QC · ตรวจข้อมูลก่อนสร้างโมเดล",
      copy: "สำรวจข้อมูลให้เห็นจุดผิดปกติและความสัมพันธ์ก่อนปล่อยให้โมเดลเรียนรู้",
      bullets: ["ตรวจความครบถ้วนของข้อมูล", "ดูรูปแบบเหตุการณ์ตามฤดูกาล", "ตรวจความสัมพันธ์และความซ้ำซ้อนของตัวแปร"]
    },
    leakage: {
      kicker: "02 / QUALITY CHECK",
      title: "Temporal gap · 49 วัน",
      copy: "เว้นช่องว่างระหว่างช่วงข้อมูลเพื่อป้องกันข้อมูลอนาคตรั่วไหลเข้าไปในขั้นฝึกหรือทดสอบ",
      bullets: ["แบ่งข้อมูลตามลำดับเวลา", "เว้น temporal gap 49 วัน", "ทำให้ผลประเมินสะท้อนการใช้งานจริงมากขึ้น"]
    },
    validation: {
      kicker: "03 / QUALITY CHECK",
      title: "Time validation · เปรียบเทียบและ calibrate",
      copy: "ประเมิน candidate ตามเวลา แล้วเลือก production model ที่เหมาะกับการสื่อสาร probability",
      bullets: ["เปรียบเทียบผลตามช่วงพยากรณ์", "ตรวจ BSS และ ROC-AUC", "production model: logistic_balanced_cal"]
    },
    probability: {
      kicker: "01 / PUBLIC OUTPUT",
      title: "Weekly probability · 2–4 สัปดาห์",
      copy: "ผลลัพธ์หลักคือความน่าจะเป็นของเหตุการณ์คลื่นความร้อนรายสัปดาห์ ไม่ใช่การพยากรณ์อุณหภูมิ",
      bullets: ["เผยแพร่เฉพาะช่วง 2–4 สัปดาห์", "อ่านเป็นแนวโน้มความเสี่ยงระดับจังหวัด", "ใช้ประกอบการเตรียมพร้อมล่วงหน้า"]
    },
    quality: {
      kicker: "02 / PUBLIC OUTPUT",
      title: "Quality gate · BSS และ ROC-AUC",
      copy: "ก่อนเผยแพร่ต้องผ่านเกณฑ์คุณภาพร่วมกัน เพื่อไม่ให้ probability ถูกตีความเกินหลักฐาน",
      bullets: ["BSS > 0", "ROC-AUC > 0.50", "ช่วง 5–6 สัปดาห์ไม่ถูกนำเสนอเป็นผลลัพธ์หลัก"]
    },
    action: {
      kicker: "03 / PUBLIC OUTPUT",
      title: "Risk map · จากโมเดลสู่การเตรียมพร้อม",
      copy: "เปลี่ยน probability ให้เป็นภาพความเสี่ยงที่ผู้ใช้ดูและนำไปวางแผนได้",
      bullets: ["แสดงผลระดับ 77 จังหวัด", "เชื่อมต่อกับหน้าแผนที่ความเสี่ยง", "สื่อสารเพื่อการเตรียมพร้อม ไม่ใช่ประกาศเตือนภัย"]
    }
  };

  const detail = document.querySelector("#diagram-detail");
  const detailKicker = document.querySelector("#diagram-detail-kicker");
  const detailTitle = document.querySelector("#diagram-detail-title");
  const detailCopy = document.querySelector("#diagram-detail-copy");
  const detailList = document.querySelector("#diagram-detail-list");

  document.querySelectorAll("[data-flow-key]").forEach((node) => {
    node.addEventListener("click", () => {
      const selected = flowDetails[node.dataset.flowKey];
      if (!selected || !detail) return;

      document.querySelectorAll("[data-flow-key]").forEach((item) => {
        const active = item === node;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      detailKicker.textContent = selected.kicker;
      detailTitle.textContent = selected.title;
      detailCopy.textContent = selected.copy;
      detailList.replaceChildren(...selected.bullets.map((bullet) => {
        const item = document.createElement("li");
        item.textContent = bullet;
        return item;
      }));
    });
  });
})();
