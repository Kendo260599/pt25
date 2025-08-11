// --- Các hàm phong thủy (giữ nguyên) ---
function parseDateParts(dateStr){
  if(!dateStr || typeof dateStr!=='string') throw new Error('Ngày sinh không hợp lệ');
  const s = dateStr.trim();
  const sep = s.includes('-') ? '-' : (s.includes('/') ? '/' : null);
  if(!sep) throw new Error('Định dạng ngày phải có "-" hoặc "/" (vd 1992-03-13 hoặc 26/05/1992)');
  const parts = s.split(sep).map(x=>parseInt(x,10));
  if(parts.length!==3 || parts.some(isNaN)) throw new Error('Định dạng ngày không đúng');
  if(parts[0] > 31) return {year:parts[0], month:parts[1], day:parts[2]};
  return {year:parts[2], month:parts[1], day:parts[0]};
}
function getEffectiveBirthYear(birthDateString){
  const {year,month,day} = parseDateParts(birthDateString);
  if(month < 3 || (month===3 && day<=13)) return year - 1;
  return year;
}
function digitalRoot(year){
  let sum = String(year).split('').reduce((a,b)=>a+Number(b),0);
  while(sum > 9) sum = String(sum).split('').reduce((a,b)=>a+Number(b),0);
  return sum;
}
const CUNG_INFO = {
  'Càn':  { nguyenTo:'Kim',  huong:'Tây Bắc' },
  'Khôn': { nguyenTo:'Thổ',  huong:'Tây Nam' },
  'Cấn':  { nguyenTo:'Thổ',  huong:'Đông Bắc' },
  'Chấn': { nguyenTo:'Mộc',  huong:'Đông' },
  'Tốn':  { nguyenTo:'Mộc',  huong:'Đông Nam' },
  'Ly':   { nguyenTo:'Hỏa',  huong:'Nam' },
  'Khảm': { nguyenTo:'Thủy', huong:'Bắc' },
  'Đoài': { nguyenTo:'Kim',  huong:'Tây' }
};
const DONG_TU = ['Khảm','Ly','Chấn','Tốn'];
const MALE_START = 1921, FEMALE_START = 1922;
const MALE_CUNG_SEQ = ['Đoài','Càn','Khôn','Tốn','Chấn','Khôn','Khảm','Ly','Cấn'];
const FEMALE_CUNG_SEQ = ['Cấn','Khảm','Ly','Tốn','Chấn','Khôn','Càn','Đoài','Cấn'];
const mod9 = n => ((n%9)+9)%9;
function getCungMenh(birthDateString, gender){
  const effectiveYear = getEffectiveBirthYear(birthDateString);
  let idx,cung;
  if(gender==='nam'){
    idx = mod9(effectiveYear - MALE_START);
    cung = MALE_CUNG_SEQ[idx];
  }else{
    idx = mod9(effectiveYear - FEMALE_START);
    cung = FEMALE_CUNG_SEQ[idx];
  }
  const {nguyenTo, huong} = CUNG_INFO[cung];
  const nhomTrach = DONG_TU.includes(cung) ? 'Đông Tứ Trạch' : 'Tây Tứ Trạch';
  return { effectiveYear, cung, nhomTrach, nguyenTo, huong };
}
function getBatTrachForCung(cung){
  const C = {
    good:{
      'Sinh Khí':{ten:'Sinh Khí',loai:'good',y:'Tài lộc, danh tiếng, thăng tiến, vượng khí.'},
      'Thiên Y': {ten:'Thiên Y', loai:'good',y:'Sức khỏe, trường thọ, quý nhân.'},
      'Diên Niên':{ten:'Diên Niên',loai:'good',y:'Hòa thuận, bền vững quan hệ.'},
      'Phục Vị': {ten:'Phục Vị', loai:'good',y:'Ổn định, thi cử, phát triển bản thân.'}
    },
    bad:{
      'Tuyệt Mệnh':{ten:'Tuyệt Mệnh',loai:'bad',y:'Nặng nhất: tổn hại lớn, bệnh tật, phá sản.'},
      'Ngũ Quỷ':   {ten:'Ngũ Quỷ',   loai:'bad',y:'Thị phi, mất mát, tranh cãi.'},
      'Lục Sát':   {ten:'Lục Sát',   loai:'bad',y:'Kiện tụng, tai nạn, bất hòa.'},
      'Họa Hại':   {ten:'Họa Hại',   loai:'bad',y:'Xui xẻo, thất bại nhỏ lẻ.'}
    }
  };
  const B = {
    'Khảm': {'Đông Nam':C.good['Sinh Khí'],'Đông':C.good['Thiên Y'],'Nam':C.good['Diên Niên'],'Bắc':C.good['Phục Vị'],'Tây Nam':C.bad['Tuyệt Mệnh'],'Đông Bắc':C.bad['Ngũ Quỷ'],'Tây Bắc':C.bad['Lục Sát'],'Tây':C.bad['Họa Hại']},
    'Ly':   {'Đông':C.good['Sinh Khí'],'Đông Nam':C.good['Thiên Y'],'Bắc':C.good['Diên Niên'],'Nam':C.good['Phục Vị'],'Tây Bắc':C.bad['Tuyệt Mệnh'],'Tây':C.bad['Ngũ Quỷ'],'Tây Nam':C.bad['Lục Sát'],'Đông Bắc':C.bad['Họa Hại']},
    'Chấn': {'Nam':C.good['Sinh Khí'],'Bắc':C.good['Thiên Y'],'Đông Nam':C.good['Diên Niên'],'Đông':C.good['Phục Vị'],'Tây':C.bad['Tuyệt Mệnh'],'Tây Bắc':C.bad['Ngũ Quỷ'],'Đông Bắc':C.bad['Lục Sát'],'Tây Nam':C.bad['Họa Hại']},
    'Tốn':  {'Bắc':C.good['Sinh Khí'],'Nam':C.good['Thiên Y'],'Đông':C.good['Diên Niên'],'Đông Nam':C.good['Phục Vị'],'Đông Bắc':C.bad['Tuyệt Mệnh'],'Tây Nam':C.bad['Ngũ Quỷ'],'Tây':C.bad['Lục Sát'],'Tây Bắc':C.bad['Họa Hại']},
    'Càn':  {'Tây':C.good['Sinh Khí'],'Đông Bắc':C.good['Thiên Y'],'Tây Nam':C.good['Diên Niên'],'Tây Bắc':C.good['Phục Vị'],'Nam':C.bad['Tuyệt Mệnh'],'Đông':C.bad['Ngũ Quỷ'],'Bắc':C.bad['Lục Sát'],'Đông Nam':C.bad['Họa Hại']},
    'Khôn': {'Đông Bắc':C.good['Sinh Khí'],'Tây':C.good['Thiên Y'],'Tây Bắc':C.good['Diên Niên'],'Tây Nam':C.good['Phục Vị'],'Bắc':C.bad['Tuyệt Mệnh'],'Đông Nam':C.bad['Ngũ Quỷ'],'Nam':C.bad['Lục Sát'],'Đông':C.bad['Họa Hại']},
    'Cấn':  {'Tây Nam':C.good['Sinh Khí'],'Tây Bắc':C.good['Thiên Y'],'Tây':C.good['Diên Niên'],'Đông Bắc':C.good['Phục Vị'],'Đông Nam':C.bad['Tuyệt Mệnh'],'Bắc':C.bad['Ngũ Quỷ'],'Đông':C.bad['Lục Sát'],'Nam':C.bad['Họa Hại']},
    'Đoài': {'Tây Bắc':C.good['Sinh Khí'],'Tây Nam':C.good['Thiên Y'],'Đông Bắc':C.good['Diên Niên'],'Tây':C.good['Phục Vị'],'Đông':C.bad['Tuyệt Mệnh'],'Nam':C.bad['Ngũ Quỷ'],'Đông Nam':C.bad['Lục Sát'],'Bắc':C.bad['Họa Hại']}
  };
  return B[cung];
}
function analyzeHouseDirection(cungObj, huongNha){
  const table = getBatTrachForCung(cungObj.cung);
  const all = Object.entries(table).map(([huong,info])=>({huong, ...info}));
  const selected = table[huongNha];
  const goods = all.filter(x=>x.loai==='good');
  const bads  = all.filter(x=>x.loai==='bad');
  return {selected, goods, bads, all};
}
function adviceForDirectionClass(cls){
  if(!cls) return [];
  if(cls==='good') return [
    'Ưu tiên cửa chính/ban công theo hướng này.',
    'Bếp, bàn thờ, giường, bàn làm việc xoay về 1 trong 4 hướng tốt.',
    'Giữ lối vào thông thoáng, sạch sẽ.'
  ];
  return [
    'Dùng bình phong/hiên/bậc tam cấp để “bẻ dòng khí xấu”.',
    'Bố trí nội thất “tọa hung – hướng cát”.',
    'Treo Bát Quái lồi ngoài cổng (cân nhắc).',
    'Tăng cây xanh, ánh sáng, nước/đá trang trí để điều hòa khí.'
  ];
}

// --- 12 con giáp & các kiểm tra năm/tháng xây ---
const ZODIAC = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
function idxZodiac(y){ return ((y-4)%12+12)%12; }
function nameZodiac(y){ return ZODIAC[idxZodiac(y)]; }
function nameByIndex(i){ return ZODIAC[i]; }

const TAM_TAI_GROUPS = [
  {group:['Thân','Tý','Thìn'], tamTai:['Dần','Mão','Thìn']},
  {group:['Dần','Ngọ','Tuất'], tamTai:['Thân','Dậu','Tuất']},
  {group:['Hợi','Mão','Mùi'], tamTai:['Tỵ','Ngọ','Mùi']},
  {group:['Tỵ','Dậu','Sửu'], tamTai:['Hợi','Tý','Sửu']}
];
function checkTamTai(ownerYear, constructionYear){
  const ownerChi = nameZodiac(ownerYear);
  const cChi = nameZodiac(constructionYear);
  const g = TAM_TAI_GROUPS.find(x=>x.group.includes(ownerChi));
  return {isTamTai: g ? g.tamTai.includes(cChi) : false, ownerChi, constructionChi:cChi, tamTaiList:g?g.tamTai:[]};
}
function tuoiMu(effYear, consYear){ return consYear - effYear + 1; }
function checkKimLau(tuoi){
  let r = tuoi%9; if(r===0) r=9;
  const types = {1:'Kim Lâu Thân',3:'Kim Lâu Thê',6:'Kim Lâu Tử',8:'Kim Lâu Lục Súc'};
  return {isKimLau:[1,3,6,8].includes(r), type:types[r]||null, remainder:r};
}
function checkHoangOc(tuoi){
  const labels = ['Nhất Cát','Nhì Nghi','Tam Địa Sát','Tứ Tấn Tài','Ngũ Thọ Tử','Lục Hoang Ốc'];
  const m = tuoi%6; const idx = (m===0)?5:m-1; const name = labels[idx];
  return {name, isBad:['Tam Địa Sát','Ngũ Thọ Tử','Lục Hoang Ốc'].includes(name)};
}
function checkXungTuoi(ownerYear, consYear){
  const opp = (idxZodiac(ownerYear)+6)%12;
  return {isXung: idxZodiac(consYear)===opp, ownerYear, consYear, oppositeChi:nameByIndex(opp), ownerChi:nameZodiac(ownerYear), constructionChi:nameZodiac(consYear)};
}
function elementYear(y){
  const s = ((y-4)%10+10)%10;
  if(s===0||s===1) return 'Mộc';
  if(s===2||s===3) return 'Hỏa';
  if(s===4||s===5) return 'Thổ';
  if(s===6||s===7) return 'Kim';
  return 'Thủy';
}
function elementMonth(month){
  month = Number(month);
  if([1,6,11].includes(month)) return 'Thủy';
  if([2,7,12].includes(month)) return 'Hỏa';
  if([3,8].includes(month)) return 'Thổ';
  if([4,9].includes(month)) return 'Kim';
  if([5,10].includes(month)) return 'Mộc';
  return null;
}
const KHAC = {'Mộc':'Thổ','Thổ':'Thủy','Thủy':'Hỏa','Hỏa':'Kim','Kim':'Mộc'};
function isElementConflict(e1,e2){
  if(!e1 || !e2) return false;
  return (KHAC[e1]===e2) || (KHAC[e2]===e1);
}

// ============== Yếu tố xấu BĐS & hóa giải (55+ mục) ==============
const ISSUES = [
  {id:'ext_hospital',cat:'Ngoại cảnh',label:'Đối diện/ gần Bệnh viện',impact:'Âm khí, lo lắng, ảnh hưởng sức khỏe.',remedy:'Tăng cây xanh, ánh sáng, rèm dày; bình phong; cân nhắc Bát Quái lồi.'},
  {id:'ext_cemetery',cat:'Ngoại cảnh',label:'Gần nghĩa trang/nhà tang lễ',impact:'Âm khí nặng, khó tụ tài.',remedy:'Hàng rào kín, cây tán dày, đèn ấm; hạn chế cửa nhìn thẳng; bình phong.'},
  {id:'ext_crematorium',cat:'Ngoại cảnh',label:'Gần lò hỏa táng',impact:'Ám khí, tâm lý bất an.',remedy:'Che chắn mạnh (cây, tường), ánh sáng vàng ấm, nước + đá trang trí cân bằng.'},
  {id:'ext_temple',cat:'Ngoại cảnh',label:'Đối diện Chùa',impact:'Khí tĩnh/âm mạnh, giảm tài khí.',remedy:'Quan Công gần cửa, chuông gió kim loại, cây Kim Ngân; tránh nhìn thẳng.'},
  {id:'ext_church',cat:'Ngoại cảnh',label:'Đối diện Nhà thờ',impact:'Khí tĩnh, người ra vào đông lúc lễ.',remedy:'Bình phong, rèm dày, điều hướng cửa phụ nếu cần.'},
  {id:'ext_school',cat:'Ngoại cảnh',label:'Đối diện Trường học',impact:'Ồn ào, khí động mạnh.',remedy:'Vách ngăn, rèm cách âm, bố trí phòng ngủ lùi sâu, tăng cây xanh.'},
  {id:'ext_market',cat:'Ngoại cảnh',label:'Sát chợ/siêu thị ồn',impact:'Khí tạp, mất riêng tư.',remedy:'Cửa hai lớp, vách kính, hàng rào, cây làm “lọc khí”.'},
  {id:'ext_gas',cat:'Ngoại cảnh',label:'Gần trạm xăng/kho gas',impact:'Hỏa khí, nguy cơ cháy nổ.',remedy:'Khoảng cách an toàn, tường chống cháy, không mở cửa trực diện.'},
  {id:'ext_transformer',cat:'Ngoại cảnh',label:'Gần trạm biến áp',impact:'Từ trường, tiếng ồn.',remedy:'Lùi cửa/cổng, tường đặc, cây cao, tránh đặt giường sát phía đó.'},
  {id:'ext_pylon',cat:'Ngoại cảnh',label:'Cột điện trước cổng',impact:'Sát khí, cản khí vào nhà.',remedy:'Lùi cổng, cây cao, bình phong; đổi vị trí cửa nếu được.'},
  {id:'ext_bts',cat:'Ngoại cảnh',label:'Cột BTS/anten',impact:'Từ trường, thị giác xấu.',remedy:'Che bằng cây, mái; hạn chế cửa/ban công nhìn thẳng.'},
  {id:'ext_deadend',cat:'Ngoại cảnh',label:'Hẻm cụt/hồi dương sát',impact:'Khí bí, đọng xấu.',remedy:'Đèn sáng, cây/đá/nước ở đầu nhà, cửa sổ lấy sáng gió phụ.'},
  {id:'ext_T',cat:'Ngoại cảnh',label:'Ngã ba chữ T đâm thẳng',impact:'Trực sát hao tài.',remedy:'Bình phong, bậc cấp “gãy dòng”, cây to; cân nhắc Bát Quái lồi.'},
  {id:'ext_Y',cat:'Ngoại cảnh',label:'Giao lộ chữ Y',impact:'Khí loạn, phân tán.',remedy:'Cổng kín, hiên che, điều hướng lối đi, cây tạo “khoang đệm”.'},
  {id:'ext_cross',cat:'Ngoại cảnh',label:'Ngã tư/giao lộ lớn',impact:'Khí động mạnh, ồn.',remedy:'Hàng rào, sảnh/hiên kín, cây + nước cân bằng, cửa phụ nếu cần.'},
  {id:'ext_curve',cat:'Ngoại cảnh',label:'Đường cong gấp (lưỡi đao)',impact:'Sát khí chém vào.',remedy:'Bình phong, cây cao, tường cong mềm; đổi hướng cửa.'},
  {id:'ext_rail',cat:'Ngoại cảnh',label:'Sát đường tàu',impact:'Rung chấn, ồn, khí xung.',remedy:'Tường chống ồn/rung, cây đệm, phòng ngủ lùi sâu.'},
  {id:'ext_highway',cat:'Ngoại cảnh',label:'Sát cao tốc/cầu vượt',impact:'Gió mạnh, ồn, bụi.',remedy:'Lam chắn gió, cây tán dày, cửa kính cách âm.'},
  {id:'ext_underbridge',cat:'Ngoại cảnh',label:'Ở dưới chân cầu',impact:'Áp lực, thiếu sáng.',remedy:'Tăng sáng, cây xanh, màu ấm, tránh phòng ngủ phía đó.'},
  {id:'ext_slope',cat:'Ngoại cảnh',label:'Đường dốc trước nhà',impact:'Khí trượt khó tụ.',remedy:'Bậc thềm, bồn cây bậc cấp, cửa lệch + bình phong.'},
  {id:'ext_lowfloor',cat:'Ngoại cảnh',label:'Nền thấp hơn mặt đường',impact:'Ngập nước, khí xấu tràn.',remedy:'Nâng cốt nền, bậc cấp, rãnh thoát nước.'},
  {id:'ext_highfloor',cat:'Ngoại cảnh',label:'Nền quá cao so với đường',impact:'Khó dẫn khí, dốc nguy hiểm.',remedy:'Thiết kế bậc thoải, tiểu cảnh mềm chuyển tiếp.'},
  {id:'ext_sharpcorner',cat:'Ngoại cảnh',label:'Góc nhọn công trình chĩa vào',impact:'Hình sát đâm vào.',remedy:'Che bằng cây, bình phong, điều chỉnh cửa/hàng rào.'},
  {id:'ext_backriver',cat:'Ngoại cảnh',label:'Sông/hồ áp sát phía sau',impact:'Thủy sau nhà dễ bất ổn.',remedy:'Hàng rào, cây, gia cố nền; không mở cửa lớn phía sau.'},
  {id:'ext_polluted',cat:'Ngoại cảnh',label:'Mương/cống ô nhiễm',impact:'Khí uế, bệnh tật.',remedy:'Che kín, xử lý mùi/thoát khí; không mở cửa/cửa sổ sát.'},
  {id:'ext_streetlight',cat:'Ngoại cảnh',label:'Đèn đường rọi thẳng cửa',impact:'Quang sát, mất ngủ.',remedy:'Rèm dày, cây/lam che, đổi hướng cửa nếu cần.'},
  {id:'lot_triangle',cat:'Lô đất',label:'Đất hình tam giác/mũi nhọn',impact:'Khó tụ tài, hình sát.',remedy:'Cắt chỉnh công năng, chừa sân/bồn cây tại đỉnh nhọn.'},
  {id:'lot_arrow',cat:'Lô đất',label:'Đất hình mũi tên/dao',impact:'Họa hại hình sát.',remedy:'Bo tròn, bố trí tiểu cảnh mềm che góc nhọn.'},
  {id:'lot_thinlong',cat:'Lô đất',label:'Đất thon dài quá mức',impact:'Khí kém phân bổ.',remedy:'Chia khoang, giếng trời, cửa sổ trung gian.'},
  {id:'lot_thophau',cat:'Lô đất',label:'Thóp hậu (sau hẹp hơn trước)',impact:'Tán tài, cuối nhà bức.',remedy:'Bố trí công năng phụ phía sau, mở sáng gió, tiểu cảnh cuối nhà.'},
  {id:'lot_khuyetgoc',cat:'Lô đất',label:'Khuyết góc quan trọng',impact:'Thiếu phương vị.',remedy:'Bù bằng mái/ban công, gương, cây – ưu tiên bù góc Tây Nam/Đông Bắc.'},
  {id:'door_front_back',cat:'Cửa & dòng khí',label:'Cửa chính thẳng cửa hậu',impact:'Khí vào tuột ra.',remedy:'Bình phong, đổi lệch cửa, thảm/tiểu cảnh giữa nhà.'},
  {id:'door_front_stair',cat:'Cửa & dòng khí',label:'Cửa chính đụng thẳng cầu thang',impact:'Khí xung, tán tài.',remedy:'Bậc đệm, bình phong, đổi hướng bậc đầu.'},
  {id:'stair_center',cat:'Cửa & dòng khí',label:'Cầu thang giữa nhà/trung cung',impact:'Động trung cung, bất ổn.',remedy:'Dịch vị trí, dùng giếng trời + cây giảm động, che chắn.'},
  {id:'stair_out',cat:'Cửa & dòng khí',label:'Cầu thang đổ thẳng cửa',impact:'Tài khí thoát nhanh.',remedy:'Chiếu nghỉ, đổi tay vịn, bình phong/chậu cây chân thang.'},
  {id:'corridor_wind',cat:'Cửa & dòng khí',label:'Hành lang thẳng hàng cửa (trực phong)',impact:'Gió xộc, khó tụ khí.',remedy:'Lam/bình phong, thảm, bố trí cửa so le.'},
  {id:'door_door_face',cat:'Cửa & dòng khí',label:'Cửa nhà đối cửa nhà khác',impact:'Khí xung đối đấu.',remedy:'Cửa lệch, bình phong, cây tán, rèm che.'},
  {id:'toilet_face_main',cat:'Cửa & dòng khí',label:'Cửa WC đối cửa chính',impact:'Uế khí xông nhà.',remedy:'Đổi mở cửa, máy hút mùi, bình phong.'},
  {id:'beam_over_bed',cat:'Kết cấu',label:'Xà ngang đè giường/sofa/bàn',impact:'Áp khí, mất ngủ.',remedy:'Trần giả che xà, đổi vị trí kê.'},
  {id:'pillar_corner',cat:'Kết cấu',label:'Cột/góc nhọn chĩa vào giường/bàn',impact:'Hình sát, đau ốm.',remedy:'Bo góc, tủ/kệ che, cây mềm.'},
  {id:'mirror_face_bed',cat:'Kết cấu',label:'Gương soi chiếu thẳng giường',impact:'Bất an, mộng mị.',remedy:'Di dời gương, dùng gương cánh tủ đóng.'},
  {id:'mirror_face_door',cat:'Kết cấu',label:'Gương đối cửa chính',impact:'Đẩy khí ra ngoài.',remedy:'Di chuyển gương lệch/trong nhà.'},
  {id:'fan_over_bed',cat:'Kết cấu',label:'Quạt trần ngay trên giường',impact:'Áp/đứt khí trên đầu.',remedy:'Dời vị trí quạt, dùng quạt đứng/treo tường.'},
  {id:'kitchen_sink_stove',cat:'Bếp',label:'Bồn rửa đối/bên cạnh sát bếp',impact:'Thủy – Hỏa xung.',remedy:'Giữ cách 60–80cm, chen vật trung gian (gỗ/đá), bố trí tam giác bếp.'},
  {id:'kitchen_back_window',cat:'Bếp',label:'Bếp lưng tựa cửa sổ',impact:'Hỏa khí bị gió thổi',remedy:'Che chắn, đổi vị trí bếp, dùng máy hút mùi.'},
  {id:'kitchen_on_septic',cat:'Bếp',label:'Bếp trên bể phốt/ống thoát',impact:'Uế khí – Hỏa',remedy:'Đổi vị trí, cách ly kỹ thuật, chống mùi.'},
  {id:'kitchen_nw',cat:'Bếp',label:'Bếp tại Tây Bắc (Thiên môn hỏa)',impact:'Dễ khắc trưởng nam/trưởng bối',remedy:'Giảm Hỏa (màu, vật liệu), tăng Kim/Thủy cân bằng, xem xét dời bếp.'},
  {id:'wc_center',cat:'WC/Phòng ngủ',label:'WC ở trung cung',impact:'Uế khí giữa nhà',remedy:'Chuyển vị trí, tăng thông gió, lọc mùi – tối kỵ.'},
  {id:'wc_above_kitchen',cat:'WC/Phòng ngủ',label:'WC trên bếp/ban thờ',impact:'Uế khắc Hỏa/Thổ',remedy:'Đổi khu kỹ thuật, chống thấm tuyệt đối, cách ly trần.'},
  {id:'wc_above_bed',cat:'WC/Phòng ngủ',label:'WC trên phòng ngủ',impact:'Ẩm mốc, bệnh vặt',remedy:'Đổi công năng hoặc gia cố chống ẩm + thông gió mạnh.'},
  {id:'wc_face_stove',cat:'WC/Phòng ngủ',label:'Cửa WC đối bếp',impact:'Uế – Hỏa xung',remedy:'Đổi hướng cửa, bình phong, cửa tự đóng + hút mùi mạnh.'},
  {id:'bed_door_line',cat:'WC/Phòng ngủ',label:'Giường thẳng cửa ra vào',impact:'Bị xung, giật mình',remedy:'Đổi vị trí giường, bình phong chân giường.'},
  {id:'bed_under_beam',cat:'WC/Phòng ngủ',label:'Giường dưới xà',impact:'Áp khí',remedy:'Trần giả, đổi vị trí.'},
  {id:'bed_west_heat',cat:'WC/Phòng ngủ',label:'Phòng ngủ tây nắng gắt',impact:'Nhiệt hỏa, khó ngủ',remedy:'Film cách nhiệt, lam che, cây xanh, màu mát.'},
  {id:'bed_no_window',cat:'WC/Phòng ngủ',label:'Phòng ngủ không cửa sổ',impact:'Thiếu khí dương',remedy:'Bổ sung thông gió cưỡng bức, giếng trời, máy lọc khí.'},
  {id:'altar_back_wc',cat:'Bàn thờ',label:'Bàn thờ tựa/giáp WC',impact:'Bất kính, uế sát',remedy:'Cách tường kỹ thuật, dời vị trí, tấm ốp cách uế.'},
  {id:'altar_under_stair',cat:'Bàn thờ',label:'Bàn thờ dưới gầm cầu thang',impact:'Động sát, ồn',remedy:'Di dời vị trí trang nghiêm, tĩnh.'},
  {id:'altar_face_kitchen',cat:'Bàn thờ',label:'Bàn thờ đối bếp',impact:'Hỏa xung tĩnh',remedy:'Bình phong, đổi hướng; ưu tiên hướng hợp mệnh.'},
  {id:'altar_face_door',cat:'Bàn thờ',label:'Bàn thờ chiếu thẳng cửa',impact:'Khí động, phô bày',remedy:'Bình phong, rèm; lùi chiến lược.'},
  {id:'aquarium_wrong',cat:'Khác',label:'Bể cá/nước đặt sai cung',impact:'Thủy sai vị trí gây hao',remedy:'Đặt tại cung hợp mệnh/Diên Niên/Sinh Khí; hạn chế gần bếp/ban thờ.'},
  {id:'tank_over_bed',cat:'Khác',label:'Bồn nước trên phòng ngủ',impact:'Áp Thủy, ẩm ồn',remedy:'Di dời hoặc gia cố chống rung/ồn, cách ly.'},
  {id:'color_conflict',cat:'Khác',label:'Màu nội thất khắc mệnh',impact:'Khí nghịch, khó chịu',remedy:'Chọn bảng màu tương sinh/tương hòa theo mệnh quái.'},
  {id:'stair_steps_bad',cat:'Khác',label:'Bậc thang rơi “Bệnh/Tử”',impact:'Tâm lý bất an',remedy:'Tính lại bậc theo Sinh - Lão - Bệnh - Tử (kết bậc vào Sinh/Lão).'},
  {id:'roof_glare',cat:'Khác',label:'Mái/biển quảng cáo phản quang chiếu vào',impact:'Quang sát',remedy:'Rèm, lam che, cây tán; đổi hướng cửa nếu cần.'},
  {id:'karaoke_bar',cat:'Khác',label:'Gần quán bar/karaoke',impact:'Ồn, khí tạp',remedy:'Cách âm mạnh, lớp cửa kép, cây/vách đệm.'},
  {id:'garbage_station',cat:'Khác',label:'Gần điểm rác/mùi hôi',impact:'Uế khí, bệnh tật',remedy:'Cách ly, bịt kín, cây khử mùi, than hoạt tính, đổi hướng cửa.'}
];
function renderIssues(filter=''){
  const wrap = document.getElementById('issues-container');
  if(!wrap) return;
  const f = (filter||'').toLowerCase();
  const list = ISSUES.filter(i=>{
    const key = (i.cat+' '+i.label).toLowerCase();
    return key.includes(f);
  });
  wrap.innerHTML = list.map(i => `
    <label class="issue-item"><input type="checkbox" name="issue" value="${i.id}">
      <span><strong>[${i.cat}]</strong> ${i.label}</span>
    </label>
  `).join('');
}
function getSelectedIssues(){
  return Array.from(document.querySelectorAll('input[name="issue"]:checked')).map(el=>el.value);
}
function checkSiteIssues(issueIds){
  const problems=[], solutions=[];
  const map = new Map(ISSUES.map(i=>[i.id,i]));
  issueIds.forEach(id=>{
    const it = map.get(id);
    if(it){
      problems.push(`${it.label}: ${it.impact}`);
      solutions.push(`Hóa giải: ${it.remedy}`);
    }
  });
  return {problems, solutions};
}

// ============== Cung mệnh theo bảng ảnh (chu kỳ 9 năm) ==============
function getCungMenh(birthDateString, gender){
  const effectiveYear = getEffectiveBirthYear(birthDateString);
  let idx,cung;
  if(gender==='nam'){
    idx = mod9(effectiveYear - 1921);
    cung = ['Đoài','Càn','Khôn','Tốn','Chấn','Khôn','Khảm','Ly','Cấn'][idx];
  }else{
    idx = mod9(effectiveYear - 1922);
    cung = ['Cấn','Khảm','Ly','Tốn','Chấn','Khôn','Càn','Đoài','Cấn'][idx];
  }
  const {nguyenTo, huong} = CUNG_INFO[cung];
  const nhomTrach = DONG_TU.includes(cung) ? 'Đông Tứ Trạch' : 'Tây Tứ Trạch';
  return { effectiveYear, cung, nhomTrach, nguyenTo, huong };
}
function getBatTrachForCung(cung){
  const C = {
    good:{'Sinh Khí':{ten:'Sinh Khí',loai:'good',y:'Tài lộc, danh tiếng, thăng tiến, vượng khí.'},'Thiên Y':{ten:'Thiên Y',loai:'good',y:'Sức khỏe, trường thọ, quý nhân.'},'Diên Niên':{ten:'Diên Niên',loai:'good',y:'Hòa thuận, bền vững quan hệ.'},'Phục Vị':{ten:'Phục Vị',loai:'good',y:'Ổn định, thi cử, phát triển bản thân.'}},
    bad:{'Tuyệt Mệnh':{ten:'Tuyệt Mệnh',loai:'bad',y:'Nặng nhất: tổn hại lớn, bệnh tật, phá sản.'},'Ngũ Quỷ':{ten:'Ngũ Quỷ',loai:'bad',y:'Thị phi, mất mát, tranh cãi.'},'Lục Sát':{ten:'Lục Sát',loai:'bad',y:'Kiện tụng, tai nạn, bất hòa.'},'Họa Hại':{ten:'Họa Hại',loai:'bad',y:'Xui xẻo, thất bại nhỏ lẻ.'}}
  };
  const B = {
    'Khảm': {'Đông Nam':C.good['Sinh Khí'],'Đông':C.good['Thiên Y'],'Nam':C.good['Diên Niên'],'Bắc':C.good['Phục Vị'],'Tây Nam':C.bad['Tuyệt Mệnh'],'Đông Bắc':C.bad['Ngũ Quỷ'],'Tây Bắc':C.bad['Lục Sát'],'Tây':C.bad['Họa Hại']},
    'Ly':   {'Đông':C.good['Sinh Khí'],'Đông Nam':C.good['Thiên Y'],'Bắc':C.good['Diên Niên'],'Nam':C.good['Phục Vị'],'Tây Bắc':C.bad['Tuyệt Mệnh'],'Tây':C.bad['Ngũ Quỷ'],'Tây Nam':C.bad['Lục Sát'],'Đông Bắc':C.bad['Họa Hại']},
    'Chấn': {'Nam':C.good['Sinh Khí'],'Bắc':C.good['Thiên Y'],'Đông Nam':C.good['Diên Niên'],'Đông':C.good['Phục Vị'],'Tây':C.bad['Tuyệt Mệnh'],'Tây Bắc':C.bad['Ngũ Quỷ'],'Đông Bắc':C.bad['Lục Sát'],'Tây Nam':C.bad['Họa Hại']},
    'Tốn':  {'Bắc':C.good['Sinh Khí'],'Nam':C.good['Thiên Y'],'Đông':C.good['Diên Niên'],'Đông Nam':C.good['Phục Vị'],'Đông Bắc':C.bad['Tuyệt Mệnh'],'Tây Nam':C.bad['Ngũ Quỷ'],'Tây':C.bad['Lục Sát'],'Tây Bắc':C.bad['Họa Hại']},
    'Càn':  {'Tây':C.good['Sinh Khí'],'Đông Bắc':C.good['Thiên Y'],'Tây Nam':C.good['Diên Niên'],'Tây Bắc':C.good['Phục Vị'],'Nam':C.bad['Tuyệt Mệnh'],'Đông':C.bad['Ngũ Quỷ'],'Bắc':C.bad['Lục Sát'],'Đông Nam':C.bad['Họa Hại']},
    'Khôn': {'Đông Bắc':C.good['Sinh Khí'],'Tây':C.good['Thiên Y'],'Tây Bắc':C.good['Diên Niên'],'Tây Nam':C.good['Phục Vị'],'Bắc':C.bad['Tuyệt Mệnh'],'Đông Nam':C.bad['Ngũ Quỷ'],'Nam':C.bad['Lục Sát'],'Đông':C.bad['Họa Hại']},
    'Cấn':  {'Tây Nam':C.good['Sinh Khí'],'Tây Bắc':C.good['Thiên Y'],'Tây':C.good['Diên Niên'],'Đông Bắc':C.good['Phục Vị'],'Đông Nam':C.bad['Tuyệt Mệnh'],'Bắc':C.bad['Ngũ Quỷ'],'Đông':C.bad['Lục Sát'],'Nam':C.bad['Họa Hại']},
    'Đoài': {'Tây Bắc':C.good['Sinh Khí'],'Tây Nam':C.good['Thiên Y'],'Đông Bắc':C.good['Diên Niên'],'Tây':C.good['Phục Vị'],'Đông':C.bad['Tuyệt Mệnh'],'Nam':C.bad['Ngũ Quỷ'],'Đông Nam':C.bad['Lục Sát'],'Bắc':C.bad['Họa Hại']}
  };
  return B[cung];
}
function analyzeHouseDirection(cungObj, huongNha){
  const table = getBatTrachForCung(cungObj.cung);
  const all = Object.entries(table).map(([huong,info])=>({huong, ...info}));
  const selected = table[huongNha];
  const goods = all.filter(x=>x.loai==='good');
  const bads  = all.filter(x=>x.loai==='bad');
  return {selected, goods, bads, all};
}
function adviceForDirectionClass(cls){
  if(!cls) return [];
  if(cls==='good') return [
    'Ưu tiên cửa chính/ban công theo hướng này.',
    'Bếp, bàn thờ, giường, bàn làm việc xoay về 1 trong 4 hướng tốt.',
    'Giữ lối vào thông thoáng, sạch sẽ.'
  ];
  return [
    'Dùng bình phong/hiên/bậc tam cấp để “bẻ dòng khí xấu”.',
    'Bố trí nội thất “tọa hung – hướng cát”.',
    'Treo Bát Quái lồi ngoài cổng (cân nhắc).',
    'Tăng cây xanh, ánh sáng, nước/đá trang trí để điều hòa khí.'
  ];
}
const ZODIAC = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
function idxZodiac(y){ return ((y-4)%12+12)%12; }
function nameZodiac(y){ return ZODIAC[idxZodiac(y)]; }
function nameByIndex(i){ return ZODIAC[i]; }
const TAM_TAI_GROUPS = [
  {group:['Thân','Tý','Thìn'], tamTai:['Dần','Mão','Thìn']},
  {group:['Dần','Ngọ','Tuất'], tamTai:['Thân','Dậu','Tuất']},
  {group:['Hợi','Mão','Mùi'], tamTai:['Tỵ','Ngọ','Mùi']},
  {group:['Tỵ','Dậu','Sửu'], tamTai:['Hợi','Tý','Sửu']}
];
function checkTamTai(ownerYear, constructionYear){
  const ownerChi = nameZodiac(ownerYear);
  const cChi = nameZodiac(constructionYear);
  const g = TAM_TAI_GROUPS.find(x=>x.group.includes(ownerChi));
  return {isTamTai: g ? g.tamTai.includes(cChi) : false, ownerChi, constructionChi:cChi, tamTaiList:g?g.tamTai:[]};
}
function tuoiMu(effYear, consYear){ return consYear - effYear + 1; }
function checkKimLau(tuoi){
  let r = tuoi%9; if(r===0) r=9;
  const types = {1:'Kim Lâu Thân',3:'Kim Lâu Thê',6:'Kim Lâu Tử',8:'Kim Lâu Lục Súc'};
  return {isKimLau:[1,3,6,8].includes(r), type:types[r]||null, remainder:r};
}
function checkHoangOc(tuoi){
  const labels = ['Nhất Cát','Nhì Nghi','Tam Địa Sát','Tứ Tấn Tài','Ngũ Thọ Tử','Lục Hoang Ốc'];
  const m = tuoi%6; const idx = (m===0)?5:m-1; const name = labels[idx];
  return {name, isBad:['Tam Địa Sát','Ngũ Thọ Tử','Lục Hoang Ốc'].includes(name)};
}
function checkXungTuoi(ownerYear, consYear){
  const opp = (idxZodiac(ownerYear)+6)%12;
  return {isXung: idxZodiac(consYear)===opp, ownerYear, consYear, oppositeChi:nameByIndex(opp), ownerChi:nameZodiac(ownerYear), constructionChi:nameZodiac(consYear)};
}
function elementYear(y){
  const s = ((y-4)%10+10)%10;
  if(s===0||s===1) return 'Mộc';
  if(s===2||s===3) return 'Hỏa';
  if(s===4||s===5) return 'Thổ';
  if(s===6||s===7) return 'Kim';
  return 'Thủy';
}
function elementMonth(month){
  month = Number(month);
  if([1,6,11].includes(month)) return 'Thủy';
  if([2,7,12].includes(m)) return 'Hỏa';
  if([3,8].includes(m)) return 'Thổ';
  if([4,9].includes(m)) return 'Kim';
  if([5,10].includes(m)) return 'Mộc';
  return null;
}
const KHAC = {'Mộc':'Thổ','Thổ':'Thủy','Thủy':'Hỏa','Hỏa':'Kim','Kim':'Mộc'};
function isElementConflict(e1,e2){
  if(!e1 || !e2) return false;
  return (KHAC[e1]===e2) || (KHAC[e2]===e1);
}

// --- Yếu tố xấu BĐS & hóa giải ---
const ISSUES = [
  {id:'ext_hospital',cat:'Ngoại cảnh',label:'Đối diện/ gần Bệnh viện',impact:'Âm khí, lo lắng, ảnh hưởng sức khỏe.',remedy:'Tăng cây xanh, ánh sáng, rèm dày; bình phong; cân nhắc Bát Quái lồi.'},
  {id:'ext_cemetery',cat:'Ngoại cảnh',label:'Gần nghĩa trang/nhà tang lễ',impact:'Âm khí nặng, khó tụ tài.',remedy:'Hàng rào kín, cây tán dày, đèn ấm; hạn chế cửa nhìn thẳng; bình phong.'},
  {id:'ext_crematorium',cat:'Ngoại cảnh',label:'Gần lò hỏa táng',impact:'Ám khí, tâm lý bất an.',remedy:'Che chắn mạnh (cây, tường), ánh sáng vàng ấm, nước + đá trang trí cân bằng.'},
  {id:'ext_temple',cat:'Ngoại cảnh',label:'Đối diện Chùa',impact:'Khí tĩnh/âm mạnh, giảm tài khí.',remedy:'Quan Công gần cửa, chuông gió kim loại, cây Kim Ngân; tránh nhìn thẳng.'},
  {id:'ext_church',cat:'Ngoại cảnh',label:'Đối diện Nhà thờ',impact:'Khí tĩnh, người ra vào đông lúc lễ.',remedy:'Bình phong, rèm dày, điều hướng cửa phụ nếu cần.'},
  {id:'ext_school',cat:'Ngoại cảnh',label:'Đối diện Trường học',impact:'Ồn ào, khí động mạnh.',remedy:'Vách ngăn, rèm cách âm, bố trí phòng ngủ lùi sâu, tăng cây xanh.'},
  {id:'ext_market',cat:'Ngoại cảnh',label:'Sát chợ/siêu thị ồn',impact:'Khí tạp, mất riêng tư.',remedy:'Cửa hai lớp, vách kính, hàng rào, cây làm “lọc khí”.'},
  {id:'ext_gas',cat:'Ngoại cảnh',label:'Gần trạm xăng/kho gas',impact:'Hỏa khí, nguy cơ cháy nổ.',remedy:'Khoảng cách an toàn, tường chống cháy, không mở cửa trực diện.'},
  {id:'ext_transformer',cat:'Ngoại cảnh',label:'Gần trạm biến áp',impact:'Từ trường, tiếng ồn.',remedy:'Lùi cửa/cổng, tường đặc, cây cao, tránh đặt giường sát phía đó.'},
  {id:'ext_pylon',cat:'Ngoại cảnh',label:'Cột điện trước cổng',impact:'Sát khí, cản khí vào nhà.',remedy:'Lùi cổng, cây cao, bình phong; đổi vị trí cửa nếu được.'},
  {id:'ext_bts',cat:'Ngoại cảnh',label:'Cột BTS/anten',impact:'Từ trường, thị giác xấu.',remedy:'Che bằng cây, mái; hạn chế cửa/ban công nhìn thẳng.'},
  {id:'ext_deadend',cat:'Ngoại cảnh',label:'Hẻm cụt/hồi dương sát',impact:'Khí bí, đọng xấu.',remedy:'Đèn sáng, cây/đá/nước ở đầu nhà, cửa sổ lấy sáng gió phụ.'},
  {id:'ext_T',cat:'Ngoại cảnh',label:'Ngã ba chữ T đâm thẳng',impact:'Trực sát hao tài.',remedy:'Bình phong, bậc cấp “gãy dòng”, cây to; cân nhắc Bát Quái lồi.'},
  {id:'ext_Y',cat:'Ngoại cảnh',label:'Giao lộ chữ Y',impact:'Khí loạn, phân tán.',remedy:'Cổng kín, hiên che, điều hướng lối đi, cây tạo “khoang đệm”.'},
  {id:'ext_cross',cat:'Ngoại cảnh',label:'Ngã tư/giao lộ lớn',impact:'Khí động mạnh, ồn.',remedy:'Hàng rào, sảnh/hiên kín, cây + nước cân bằng, cửa phụ nếu cần.'},
  {id:'ext_curve',cat:'Ngoại cảnh',label:'Đường cong gấp (lưỡi đao)',impact:'Sát khí chém vào.',remedy:'Bình phong, cây cao, tường cong mềm; đổi hướng cửa.'},
  {id:'ext_rail',cat:'Ngoại cảnh',label:'Sát đường tàu',impact:'Rung chấn, ồn, khí xung.',remedy:'Tường chống ồn/rung, cây đệm, phòng ngủ lùi sâu.'},
  {id:'ext_highway',cat:'Ngoại cảnh',label:'Sát cao tốc/cầu vượt',impact:'Gió mạnh, ồn, bụi.',remedy:'Lam chắn gió, cây tán dày, cửa kính cách âm.'},
  {id:'ext_underbridge',cat:'Ngoại cảnh',label:'Ở dưới chân cầu',impact:'Áp lực, thiếu sáng.',remedy:'Tăng sáng, cây xanh, màu ấm, tránh phòng ngủ phía đó.'},
  {id:'ext_slope',cat:'Ngoại cảnh',label:'Đường dốc trước nhà',impact:'Khí trượt khó tụ.',remedy:'Bậc thềm, bồn cây bậc cấp, cửa lệch + bình phong.'},
  {id:'ext_lowfloor',cat:'Ngoại cảnh',label:'Nền thấp hơn mặt đường',impact:'Ngập nước, khí xấu tràn.',remedy:'Nâng cốt nền, bậc cấp, rãnh thoát nước.'},
  {id:'ext_highfloor',cat:'Ngoại cảnh',label:'Nền quá cao so với đường',impact:'Khó dẫn khí, dốc nguy hiểm.',remedy:'Thiết kế bậc thoải, tiểu cảnh mềm chuyển tiếp.'},
  {id:'ext_sharpcorner',cat:'Ngoại cảnh',label:'Góc nhọn công trình chĩa vào',impact:'Hình sát đâm vào.',remedy:'Che bằng cây, bình phong, điều chỉnh cửa/hàng rào.'},
  {id:'ext_backriver',cat:'Ngoại cảnh',label:'Sông/hồ áp sát phía sau',impact:'Thủy sau nhà dễ bất ổn.',remedy:'Hàng rào, cây, gia cố nền; không mở cửa lớn phía sau.'},
  {id:'ext_polluted',cat:'Ngoại cảnh',label:'Mương/cống ô nhiễm',impact:'Khí uế, bệnh tật.',remedy:'Che kín, xử lý mùi/thoát khí; không mở cửa/cửa sổ sát.'},
  {id:'ext_streetlight',cat:'Ngoại cảnh',label:'Đèn đường rọi thẳng cửa',impact:'Quang sát, mất ngủ.',remedy:'Rèm dày, cây/lam che, đổi hướng cửa nếu cần.'},
  {id:'lot_triangle',cat:'Lô đất',label:'Đất hình tam giác/mũi nhọn',impact:'Khó tụ tài, hình sát.',remedy:'Cắt chỉnh công năng, chừa sân/bồn cây tại đỉnh nhọn.'},
  {id:'lot_arrow',cat:'Lô đất',label:'Đất hình mũi tên/dao',impact:'Họa hại hình sát.',remedy:'Bo tròn, bố trí tiểu cảnh mềm che góc nhọn.'},
  {id:'lot_thinlong',cat:'Lô đất',label:'Đất thon dài quá mức',impact:'Khí kém phân bổ.',remedy:'Chia khoang, giếng trời, cửa sổ trung gian.'},
  {id:'lot_thophau',cat:'Lô đất',label:'Thóp hậu (sau hẹp hơn trước)',impact:'Tán tài, cuối nhà bức.',remedy:'Bố trí công năng phụ phía sau, mở sáng gió, tiểu cảnh cuối nhà.'},
  {id:'lot_khuyetgoc',cat:'Lô đất',label:'Khuyết góc quan trọng',impact:'Thiếu phương vị.',remedy:'Bù bằng mái/ban công, gương, cây – ưu tiên bù góc Tây Nam/Đông Bắc.'},
  {id:'door_front_back',cat:'Cửa & dòng khí',label:'Cửa chính thẳng cửa hậu',impact:'Khí vào tuột ra.',remedy:'Bình phong, đổi lệch cửa, thảm/tiểu cảnh giữa nhà.'},
  {id:'door_front_stair',cat:'Cửa & dòng khí',label:'Cửa chính đụng thẳng cầu thang',impact:'Khí xung, tán tài.',remedy:'Bậc đệm, bình phong, đổi hướng bậc đầu.'},
  {id:'stair_center',cat:'Cửa & dòng khí',label:'Cầu thang giữa nhà/trung cung',impact:'Động trung cung, bất ổn.',remedy:'Dịch vị trí, dùng giếng trời + cây giảm động, che chắn.'},
  {id:'stair_out',cat:'Cửa & dòng khí',label:'Cầu thang đổ thẳng cửa',impact:'Tài khí thoát nhanh.',remedy:'Chiếu nghỉ, đổi tay vịn, bình phong/chậu cây chân thang.'},
  {id:'corridor_wind',cat:'Cửa & dòng khí',label:'Hành lang thẳng hàng cửa (trực phong)',impact:'Gió xộc, khó tụ khí.',remedy:'Lam/bình phong, thảm, bố trí cửa so le.'},
  {id:'door_door_face',cat:'Cửa & dòng khí',label:'Cửa nhà đối cửa nhà khác',impact:'Khí xung đối đấu.',remedy:'Cửa lệch, bình phong, cây tán, rèm che.'},
  {id:'toilet_face_main',cat:'Cửa & dòng khí',label:'Cửa WC đối cửa chính',impact:'Uế khí xông nhà.',remedy:'Đổi mở cửa, máy hút mùi, bình phong.'},
  {id:'beam_over_bed',cat:'Kết cấu',label:'Xà ngang đè giường/sofa/bàn',impact:'Áp khí, mất ngủ.',remedy:'Trần giả che xà, đổi vị trí kê.'},
  {id:'pillar_corner',cat:'Kết cấu',label:'Cột/góc nhọn chĩa vào giường/bàn',impact:'Hình sát, đau ốm.',remedy:'Bo góc, tủ/kệ che, cây mềm.'},
  {id:'mirror_face_bed',cat:'Kết cấu',label:'Gương soi chiếu thẳng giường',impact:'Bất an, mộng mị.',remedy:'Di dời gương, dùng gương cánh tủ đóng.'},
  {id:'mirror_face_door',cat:'Kết cấu',label:'Gương đối cửa chính',impact:'Đẩy khí ra ngoài.',remedy:'Di chuyển gương lệch/trong nhà.'},
  {id:'fan_over_bed',cat:'Kết cấu',label:'Quạt trần ngay trên giường',impact:'Áp/đứt khí trên đầu.',remedy:'Dời vị trí quạt, dùng quạt đứng/treo tường.'},
  {id:'kitchen_sink_stove',cat:'Bếp',label:'Bồn rửa đối/bên cạnh sát bếp',impact:'Thủy – Hỏa xung.',remedy:'Giữ cách 60–80cm, chen vật trung gian (gỗ/đá), bố trí tam giác bếp.'},
  {id:'kitchen_back_window',cat:'Bếp',label:'Bếp lưng tựa cửa sổ',impact:'Hỏa khí bị gió thổi',remedy:'Che chắn, đổi vị trí bếp, dùng máy hút mùi.'},
  {id:'kitchen_on_septic',cat:'Bếp',label:'Bếp trên bể phốt/ống thoát',impact:'Uế khí – Hỏa',remedy:'Đổi vị trí, cách ly kỹ thuật, chống mùi.'},
  {id:'kitchen_nw',cat:'Bếp',label:'Bếp tại Tây Bắc (Thiên môn hỏa)',impact:'Dễ khắc trưởng nam/trưởng bối',remedy:'Giảm Hỏa (màu, vật liệu), tăng Kim/Thủy cân bằng, xem xét dời bếp.'},
  {id:'wc_center',cat:'WC/Phòng ngủ',label:'WC ở trung cung',impact:'Uế khí giữa nhà',remedy:'Chuyển vị trí, tăng thông gió, lọc mùi – tối kỵ.'},
  {id:'wc_above_kitchen',cat:'WC/Phòng ngủ',label:'WC trên bếp/ban thờ',impact:'Uế khắc Hỏa/Thổ',remedy:'Đổi khu kỹ thuật, chống thấm tuyệt đối, cách ly trần.'},
  {id:'wc_above_bed',cat:'WC/Phòng ngủ',label:'WC trên phòng ngủ',impact:'Ẩm mốc, bệnh vặt',remedy:'Đổi công năng hoặc gia cố chống ẩm + thông gió mạnh.'},
  {id:'wc_face_stove',cat:'WC/Phòng ngủ',label:'Cửa WC đối bếp',impact:'Uế – Hỏa xung',remedy:'Đổi hướng cửa, bình phong, cửa tự đóng + hút mùi mạnh.'},
  {id:'bed_door_line',cat:'WC/Phòng ngủ',label:'Giường thẳng cửa ra vào',impact:'Bị xung, giật mình',remedy:'Đổi vị trí giường, bình phong chân giường.'},
  {id:'bed_under_beam',cat:'WC/Phòng ngủ',label:'Giường dưới xà',impact:'Áp khí',remedy:'Trần giả, đổi vị trí.'},
  {id:'bed_west_heat',cat:'WC/Phòng ngủ',label:'Phòng ngủ tây nắng gắt',impact:'Nhiệt hỏa, khó ngủ',remedy:'Film cách nhiệt, lam che, cây xanh, màu mát.'},
  {id:'bed_no_window',cat:'WC/Phòng ngủ',label:'Phòng ngủ không cửa sổ',impact:'Thiếu khí dương',remedy:'Bổ sung thông gió cưỡng bức, giếng trời, máy lọc khí.'},
  {id:'altar_back_wc',cat:'Bàn thờ',label:'Bàn thờ tựa/giáp WC',impact:'Bất kính, uế sát',remedy:'Cách tường kỹ thuật, dời vị trí, tấm ốp cách uế.'},
  {id:'altar_under_stair',cat:'Bàn thờ',label:'Bàn thờ dưới gầm cầu thang',impact:'Động sát, ồn',remedy:'Di dời vị trí trang nghiêm, tĩnh.'},
  {id:'altar_face_kitchen',cat:'Bàn thờ',label:'Bàn thờ đối bếp',impact:'Hỏa xung tĩnh',remedy:'Bình phong, đổi hướng; ưu tiên hướng hợp mệnh.'},
  {id:'altar_face_door',cat:'Bàn thờ',label:'Bàn thờ chiếu thẳng cửa',impact:'Khí động, phô bày',remedy:'Bình phong, rèm; lùi chiến lược.'},
  {id:'aquarium_wrong',cat:'Khác',label:'Bể cá/nước đặt sai cung',impact:'Thủy sai vị trí gây hao',remedy:'Đặt tại cung hợp mệnh/Diên Niên/Sinh Khí; hạn chế gần bếp/ban thờ.'},
  {id:'tank_over_bed',cat:'Khác',label:'Bồn nước trên phòng ngủ',impact:'Áp Thủy, ẩm ồn',remedy:'Di dời hoặc gia cố chống rung/ồn, cách ly.'},
  {id:'color_conflict',cat:'Khác',label:'Màu nội thất khắc mệnh',impact:'Khí nghịch, khó chịu',remedy:'Chọn bảng màu tương sinh/tương hòa theo mệnh quái.'},
  {id:'stair_steps_bad',cat:'Khác',label:'Bậc thang rơi “Bệnh/Tử”',impact:'Tâm lý bất an',remedy:'Tính lại bậc theo Sinh - Lão - Bệnh - Tử (kết bậc vào Sinh/Lão).'},
  {id:'roof_glare',cat:'Khác',label:'Mái/biển quảng cáo phản quang chiếu vào',impact:'Quang sát',remedy:'Rèm, lam che, cây tán; đổi hướng cửa nếu cần.'},
  {id:'karaoke_bar',cat:'Khác',label:'Gần quán bar/karaoke',impact:'Ồn, khí tạp',remedy:'Cách âm mạnh, lớp cửa kép, cây/vách đệm.'},
  {id:'garbage_station',cat:'Khác',label:'Gần điểm rác/mùi hôi',impact:'Uế khí, bệnh tật',remedy:'Cách ly, bịt kín, cây khử mùi, than hoạt tính, đổi hướng cửa.'}
];
function renderIssues(filter=''){
  const wrap = document.getElementById('issues-container');
  if(!wrap) return;
  const f = (filter||'').toLowerCase();
  const list = ISSUES.filter(i=>{
    const key = (i.cat+' '+i.label+' '+i.impact+' '+i.remedy).toLowerCase();
    return key.includes(f);
  });
  wrap.innerHTML = list.map(i => `
    <label class="issue-item"><input type="checkbox" name="issue" value="${i.id}">
      <span><strong>[${i.cat}]</strong> ${i.label}</span>
    </label>
  `).join('');
}
function getSelectedIssues(){
  return Array.from(document.querySelectorAll('input[name="issue"]:checked')).map(el=>el.value);
}
function checkSiteIssues(issueIds){
  const problems=[], solutions=[];
  const map = new Map(ISSUES.map(i=>[i.id,i]));
  issueIds.forEach(id=>{
    const it = map.get(id);
    if(it){
      problems.push(`${it.label}: ${it.impact}`);
      solutions.push(`Hóa giải: ${it.remedy}`);
    }
  });
  return {problems, solutions};
}

// --- La bàn số ---
let compassActive = false;
let orientationHandler = null;
function degNormalize(x){ x = x % 360; return x<0 ? x+360 : x; }
function degreeToDirection(deg){
  const d = degNormalize(deg);
  if(d>=337.5 || d<22.5) return 'Bắc';
  if(d<67.5)  return 'Đông Bắc';
  if(d<112.5) return 'Đông';
  if(d<157.5) return 'Đông Nam';
  if(d<202.5) return 'Nam';
  if(d<247.5) return 'Tây Nam';
  if(d<292.5) return 'Tây';
  return 'Tây Bắc';
}
function updateCompassUI(deg){
  const offset = parseFloat(document.getElementById('compass-offset').value||'0') || 0;
  const showDeg = degNormalize(deg + offset);
  document.getElementById('compass-deg').textContent = showDeg.toFixed(0);
  document.getElementById('compass-dir').textContent = degreeToDirection(showDeg);
  document.getElementById('needle').style.transform = `translate(-50%,-100%) rotate(${showDeg}deg)`;
}
async function startCompass(){
  const status = document.getElementById('compass-status');
  try{
    if(!('DeviceOrientationEvent' in window)){
      status.textContent = 'Thiết bị không hỗ trợ la bàn.';
      return;
    }
    if(typeof DeviceOrientationEvent.requestPermission === 'function'){
      const perm = await DeviceOrientationEvent.requestPermission();
      if(perm !== 'granted'){ status.textContent = 'Chưa được cấp quyền truy cập cảm biến.'; return; }
    }
    orientationHandler = (e)=>{
      let heading = null;
      if(typeof e.webkitCompassHeading === 'number' && !isNaN(e.webkitCompassHeading)){
        heading = e.webkitCompassHeading;
      }else if(typeof e.alpha === 'number'){
        heading = 360 - e.alpha;
      }
      if(heading!=null) updateCompassUI(heading);
    };
    window.addEventListener('deviceorientation', orientationHandler, true);
    compassActive = true;
    status.textContent = 'Đang đo… Giữ máy song song mặt đất & lắc hình số 8.';
  }catch(err){
    status.textContent = 'Lỗi la bàn: ' + (err.message||err);
  }
}
function stopCompass(){
  if(orientationHandler){
    window.removeEventListener('deviceorientation', orientationHandler, true);
    orientationHandler = null;
  }
  compassActive = false;
  document.getElementById('compass-status').textContent = 'Đã dừng.';
}
function applyCompassToDirection(){
  const deg = parseFloat(document.getElementById('compass-deg').textContent);
  if(isNaN(deg)) return alert('Chưa có dữ liệu la bàn.');
  document.getElementById('huong-nha').value = degreeToDirection(deg);
  alert('Đã gán hướng nhà = ' + degreeToDirection(deg));
}

// --- Lưu hồ sơ + BD (LocalStorage) ---
const STORAGE_KEY = 'ptpro_profiles_v1';
const getProfiles = ()=> JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
const setProfiles = arr => localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
const uuid = ()=> (crypto?.randomUUID ? crypto.randomUUID() : 'id_'+Date.now()+Math.random().toString(16).slice(2));
function normalizePhone(phone){
  const p = (phone||'').replace(/[^\d+]/g,'').trim();
  if(p.startsWith('+84')) return p;
  if(p.startsWith('0') && p.length>=9) return '+84'+p.slice(1);
  return p;
}
function isValidPhone(phone){
  const p = normalizePhone(phone);
  const vnMobile = /^\+?84(3|5|7|8|9)\d{8}$/;
  const generic  = /^\+?\d{8,13}$/;
  return vnMobile.test(p) || generic.test(p);
}

// BD - Phường/Xã
const DONG_NAI_WARDS = {
    'Biên Hòa': ['An Bình','Bửu Long','Hòa An','Hố Nai','Long Bình','Long Bình Tân','Phước Tân','Quang Vinh','Quang Vinh','Tân Biên','Tân Hạnh','Tân Hiệp','Tân Hòa','Tân Mai','Tân Phong','Tân Vạn','Thanh An','Thành Công','Thống Nhất','Trảng Dài'],
    'Long Thành': ['An Phước','Bình Sơn','Lộc An','Long An','Long Phước','Phước Thái','Suối Trầu'],
    'Nhơn Trạch': ['Hiệp Phước','Long Tân','Phú Đông','Phú Hội','Phú Thạnh','Phước An','Phước Khánh','Vĩnh Thanh'],
    'Định Quán': ['Gia Canh','La Ngà','Phú Cường','Phú Hòa','Thanh Sơn'],
    'Vĩnh Cửu': ['Bình Lợi','Hiếu Liêm','Hòa Bình','Mã Đà','Thạnh Phú'],
    'Trảng Bom': ['Bắc Sơn','Bình Minh','Đồi 61','Giang Điền','Hố Nai 3','Sông Trầu','Thanh Bình','Trảng Bom'],
    'Tân Phú': ['Phú Cường','Phú Lâm','Phú Lộc','Phú Trung','Phú Vĩnh','Tân Lợi'],
    'Cẩm Mỹ': ['Long Giao','Xuân Quế','Xuân Đường'],
    'Thống Nhất': ['Gia Kiệm','Gia Tân','Hưng Lộc','Lộ 25'],
    'Xuân Lộc': ['Bảo Hòa','Bảo Bình','Lang Minh','Xuân Bắc','Xuân Định','Xuân Hưng','Xuân Lộc','Xuân Tâm','Xuân Thọ','Xuân Trường']
};
function renderWardDatalist(district){
  const datalist = document.getElementById('ward-list');
  if(!datalist) return;
  const wards = DONG_NAI_WARDS[district] || [];
  datalist.innerHTML = wards.map(w=>`<option value="${w}"></option>`).join('');
}

// 2) Gather inputs cho toàn bộ hồ sơ khách hàng + BD
function gatherInputs(){
  const name  = document.getElementById('kh-ten').value.trim();
  const phone = document.getElementById('kh-phone').value.trim();
  const birth = document.getElementById('ngay-sinh').value.trim();
  const gender= document.getElementById('gioi-tinh').value;
  const huongNha= document.getElementById('huong-nha').value;
  const yearX = parseInt(document.getElementById('nam-xay').value,10);
  const monthX= parseInt(document.getElementById('thang-xay').value,10);
  const issueIds = getSelectedIssues();
  
  // BD fields
  const bds = {
    district: document.getElementById('bd-district').value,
    ward: document.getElementById('bd-ward').value.trim(),
    to: document.getElementById('bd-to').value.trim(),
    thua: document.getElementById('bd-thua').value.trim(),
    addressDetail: document.getElementById('bd-address-detail').value.trim(),
    price: parseFloat(document.getElementById('bd-price').value) || 0,
    note: document.getElementById('bd-note').value.trim()
  };
  bds.fullAddress = [bds.addressDetail, bds.ward, bds.district, 'Đồng Nai'].filter(Boolean).join(', ');

  return { name, phone, birth, gender, huongNha, yearX, monthX, bds, issueIds };
}

// 3) Lưu hồ sơ
function saveProfile(currentResult){
  const i = gatherInputs();
  if(!i.name) return alert('Vui lòng nhập họ tên khách hàng.');
  if(!i.phone) return alert('Vui lòng nhập số điện thoại.');
  if(!isValidPhone(i.phone)) return alert('SĐT chưa đúng định dạng.');
  if(!i.birth) return alert('Vui lòng nhập ngày sinh.');
  if(!i.yearX || i.yearX<1900 || i.yearX>2099) return alert('Năm xây không hợp lệ.');
  if(!i.monthX || i.monthX<1 || i.monthX>12) return alert('Tháng xây không hợp lệ.');

  const R = currentResult || evaluateAll(i.birth, i.gender, i.huongNha, i.yearX, i.monthX, i.issueIds);

  const profiles = getProfiles();
  const phoneKey = normalizePhone(i.phone);
  const existIdx = profiles.findIndex(p => p.customer.phoneKey === phoneKey);
  const profile = {
    id: existIdx>=0 ? profiles[existIdx].id : uuid(),
    createdAt: existIdx>=0 ? profiles[existIdx].createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customer: { name: i.name, phone: i.phone, phoneKey },
    input: { birth: i.birth, gender: i.gender, huongNha: i.huongNha, year: i.yearX, month: i.monthX, issues: i.issueIds },
    bds: i.bds,
    summary: {
      cung: R.build.cung.cung,
      menh: R.build.cung.nguyenTo,
      nhom: R.build.cung.nhomTrach,
      huongNha: i.huongNha,
      bdFullAddress: i.bds.fullAddress || '',
      bdPrice: i.bds.price || 0,
    },
    result: R
  };

  if(existIdx>=0) profiles[existIdx] = profile; else profiles.unshift(profile);
  setProfiles(profiles);
  renderProfiles();
  alert('Đã lưu hồ sơ khách hàng có BD.');
}

// 4) Render danh sách hồ sơ
function renderProfiles(filter=''){
  const tbody = document.getElementById('profiles-tbody');
  const list = getProfiles().filter(p=>{
    const key = (p.customer.name+' '+p.customer.phone).toLowerCase();
    return key.includes(filter.toLowerCase());
  });
  const fmt = s => new Date(s).toLocaleString();
  tbody.innerHTML = list.map(p=>`
    <tr data-id="${p.id}">
      <td>${p.customer.name}</td>
      <td>${p.customer.phone}</td>
      <td>${p.summary.cung} (${p.summary.menh})</td>
      <td>${p.summary.huongNha}</td>
      <td>${p.bds?.ward || ''} ${p.bds?.district || ''}</td>
      <td>${p.bds?.price ? new Intl.NumberFormat('vi-VN', {style:'currency', currency:'VND'}).format(p.bds.price) : ''}</td>
      <td>${fmt(p.createdAt)}</td>
      <td class="row-actions">
        <button class="view">Xem</button>
        <button class="delete">Xóa</button>
      </td>
    </tr>
  `).join('');
}

// 5) Export CSV
function exportCSV(){
  const rows = getProfiles();
  if(rows.length===0) return alert('Chưa có dữ liệu để xuất.');
  const header = ['id','name','phone','birth','gender','huongNha','year','month','issues','cung','menh','nhom',
                  'bd_district','bd_ward','bd_to','bd_thua','bd_address_detail','bd_fullAddress','bd_price','bd_note','createdAt'];
  const csvRows = [header.join(',')];
  rows.forEach(p=>{
    const b = p.bds || {};
    const r = [
      p.id,
      `"${(p.customer.name||'').replace(/"/g,'""')}"`,
      p.customer.phone,
      p.input.birth,
      p.input.gender,
      p.input.huongNha,
      p.input.year,
      p.input.month,
      `"${(p.input.issues||[]).join('|')}"`,
      p.summary.cung,
      p.summary.menh,
      p.summary.nhom,
      b.district || '',
      b.ward || '',
      b.to || '',
      b.thua || '',
      `"${b.addressDetail||''}"`,
      `"${b.fullAddress||''}"`,
      b.price || '',
      `"${b.note||''}"`,
      p.createdAt
    ];
    csvRows.push(r.join(','));
  });
  const blob = new Blob([csvRows.join('\n')], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'khach_hang_phong_thuy_bds.csv';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 6) Cập nhật và load data (từ LocalStorage)
function loadBDFromProfile(p){
  if(!p) return;
  const b = p.bds || {};
  document.getElementById('bd-district').value = b.district || '';
  document.getElementById('bd-ward').value = b.ward || '';
  document.getElementById('bd-to').value = b.to || '';
  document.getElementById('bd-thua').value = b.thua || '';
  document.getElementById('bd-address-detail').value = b.addressDetail || '';
  document.getElementById('bd-price').value = b.price || '';
  document.getElementById('bd-note').value = b.note || '';
  document.getElementById('bd-address-preview').textContent = b.fullAddress || '—';
}

// 7) DOM events và logic chính
document.addEventListener('DOMContentLoaded', ()=>{
  renderIssues();
  renderProfiles();
  const bdDistrictEl = document.getElementById('bd-district');
  const bdWardEl = document.getElementById('bd-ward');
  const bdAddressDetailEl = document.getElementById('bd-address-detail');
  const bdAddressPreviewEl = document.getElementById('bd-address-preview');

  renderWardDatalist(bdDistrictEl.value);
  bdDistrictEl.addEventListener('change', (e)=>{
    renderWardDatalist(e.target.value);
    bdWardEl.value = '';
  });

  const updateAddressPreview = ()=>{
    const district = bdDistrictEl.value;
    const ward = bdWardEl.value;
    const addressDetail = bdAddressDetailEl.value;
    const fullAddress = [addressDetail, ward, district, 'Đồng Nai'].filter(Boolean).join(', ');
    bdAddressPreviewEl.textContent = fullAddress || '—';
  };
  bdDistrictEl.addEventListener('input', updateAddressPreview);
  bdWardEl.addEventListener('input', updateAddressPreview);
  bdAddressDetailEl.addEventListener('input', updateAddressPreview);
  
  const btnAnalyze = document.getElementById('btn-analyze');
  const btnSave    = document.getElementById('btn-save');
  const btnExport  = document.getElementById('btn-export');
  const searchBox  = document.getElementById('profiles-search');

  btnAnalyze?.addEventListener('click', ()=>{
    try{
      const i = gatherInputs();
      if(!i.birth) return alert('Vui lòng nhập ngày sinh.');
      if(!i.yearX || i.yearX<1900 || i.yearX>2099) return alert('Vui lòng nhập năm xây hợp lệ.');
      if(!i.monthX || i.monthX<1 || i.monthX>12) return alert('Vui lòng chọn tháng xây (1–12).');
      const R = evaluateAll(i.birth, i.gender, i.huongNha, i.yearX, i.monthX, i.issueIds);
      const r = document.getElementById('result-content');
      let html = '';
      html += `<div class="ket-luan">`;
      html += `<div><span class="badge">Cung mệnh</span> <strong>${R.build.cung.cung}</strong> — Ngũ hành: <strong>${R.build.cung.nguyenTo}</strong> — Nhóm: <strong>${R.build.cung.nhomTrach}</strong></div>`;
      html += `</div>`;
      const sel = R.dir.selected;
      html += `<h3 class="block-title">Hướng nhà: ${i.huongNha} <span class="tag ${sel?.loai||'warn'}">${sel?sel.ten:'?'}</span></h3>`;
      if(sel){
        html += `<p><em>Ý nghĩa:</em> ${sel.y}</p>`;
        const adv = adviceForDirectionClass(sel.loai);
        if(adv.length){ html += `<p><strong>Gợi ý:</strong></p><ul class="clean">`+adv.map(a=>`<li>${a}</li>`).join('')+`</ul>`; }
      }
      if(R.dir.goods?.length){
        const priority = {'Sinh Khí':1,'Thiên Y':2,'Diên Niên':3,'Phục Vị':4};
        const gsort = [...R.dir.goods].sort((a,b)=>(priority[a.ten]||9)-(priority[b.ten]||9));
        html += `<p><strong>4 hướng tốt nên ưu tiên:</strong></p><ul class="clean">` +
          gsort.map(g => `<li><span class="good">${g.huong}</span> — ${g.ten}: ${g.y}</li>`).join('') +
          `</ul>`;
      }
      html += `<hr/>`;
      html += `<h3 class="block-title">Năm/Tháng xây</h3>`;
      html += `<p>Tuổi mụ: <strong>${R.build.ageMu}</strong> — Ngũ hành năm: <strong>${R.build.yearElement}</strong> — Ngũ hành tháng: <strong>${R.build.monthElement||'?'}</strong></p>`;
      if(R.build.yearWarnings.length===0) html += `<p class="good">Năm ${i.yearX}: Không thấy cảnh báo lớn.</p>`;
      else html += `<p><strong>Cảnh báo năm ${i.yearX}:</strong></p><ul class="clean">`+R.build.yearWarnings.map(w=>`<li class="bad">${w}</li>`).join('')+`</ul>`;
      if(R.build.monthWarnings.length===0) html += `<p class="good">Tháng ${i.monthX}: Không thấy cảnh báo lớn.</p>`;
      else html += `<p><strong>Cảnh báo tháng ${i.monthX}:</strong></p><ul class="clean">`+R.build.monthWarnings.map(w=>`<li class="warn">${w}</li>`).join('')+`</ul>`;
      html += `<hr/><h3 class="block-title">Môi trường xung quanh & lỗi phong thủy</h3>`;
      if(R.site.problems.length===0) html += `<p class="good">Không phát hiện yếu tố xấu đã chọn.</p>`;
      else{
        html += `<p><strong>Vấn đề:</strong></p><ul class="clean">`+R.site.problems.map(p=>`<li class="bad">${p}</li>`).join('')+`</ul>`;
        html += `<p><strong>Hóa giải gợi ý:</strong></p><ul class="clean">`+R.site.solutions.map(s=>`<li>${s}</li>`).join('')+`</ul>`;
      }
      html += `<hr/><h3 class="block-title">Thông tin bất động sản (BD)</h3>`;
      if(i.bds?.fullAddress){
        html += `<p><strong>Địa chỉ BD:</strong> ${i.bds.fullAddress}</p>`;
        html += `<p><strong>Tờ / Thửa:</strong> ${i.bds.to || ''} / ${i.bds.thua || ''}</p>`;
        html += `<p><strong>Giá BD:</strong> ${i.bds.price ? new Intl.NumberFormat('vi-VN', {style:'currency', currency:'VND'}).format(i.bds.price) : '0'} </p>`;
        html += `<p><strong>Ghi chú BD:</strong> ${i.bds.note || ''}</p>`;
      } else {
        html += `<p>Chưa nhập BD...</p>`;
      }
      document.getElementById('result-content').innerHTML = html;
    }catch(err){
      console.error(err); alert('Lỗi: '+(err.message||err));
    }
  });

  btnSave?.addEventListener('click', ()=>{ try{ saveProfile(); }catch(err){ alert('Lỗi: '+(err.message||err)); }});
  btnExport?.addEventListener('click', exportCSV);
  searchBox?.addEventListener('input', e=> renderProfiles(e.target.value));

  document.getElementById('profiles-tbody')?.addEventListener('click', e=>{
    const tr = e.target.closest('tr'); if(!tr) return;
    const id = tr.getAttribute('data-id');
    const profiles = getProfiles();
    const p = profiles.find(x=>x.id===id);
    if(!p) return;
    if(e.target.classList.contains('view')){
      if(p.bds){ loadBDFromProfile(p); }
      document.getElementById('kh-ten').value = p.customer.name;
      document.getElementById('kh-phone').value = p.customer.phone;
      document.getElementById('ngay-sinh').value = p.input.birth;
      document.getElementById('gioi-tinh').value = p.input.gender;
      document.getElementById('huong-nha').value = p.input.huongNha;
      document.getElementById('nam-xay').value = p.input.year;
      document.getElementById('thang-xay').value = p.input.month;
      document.getElementById('btn-analyze').click();
      window.scrollTo({top:0, behavior:'smooth'});
    }
    if(e.target.classList.contains('delete')){
      if(confirm('Xóa hồ sơ này?')){
        setProfiles(profiles.filter(x=>x.id!==id));
        renderProfiles(searchBox.value);
      }
    }
  });

  const bdDistrictEl = document.getElementById('bd-district');
  const bdWardEl = document.getElementById('bd-ward');
  const bdAddressDetailEl = document.getElementById('bd-address-detail');
  const bdAddressPreviewEl = document.getElementById('bd-address-preview');

  renderWardDatalist(bdDistrictEl.value);
  bdDistrictEl.addEventListener('change', (e)=>{
    renderWardDatalist(e.target.value);
    bdWardEl.value = '';
  });
  const updateAddressPreview = ()=>{
    const district = bdDistrictEl.value;
    const ward = bdWardEl.value;
    const addressDetail = bdAddressDetailEl.value;
    const fullAddress = [addressDetail, ward, district, 'Đồng Nai'].filter(Boolean).join(', ');
    bdAddressPreviewEl.textContent = fullAddress || '—';
  };
  bdDistrictEl.addEventListener('input', updateAddressPreview);
  bdWardEl.addEventListener('input', updateAddressPreview);
  bdAddressDetailEl.addEventListener('input', updateAddressPreview);

  document.getElementById('btn-compass-start')?.addEventListener('click', startCompass);
  document.getElementById('btn-compass-stop')?.addEventListener('click', stopCompass);
  document.getElementById('btn-compass-apply')?.addEventListener('click', applyCompassToDirection);
});