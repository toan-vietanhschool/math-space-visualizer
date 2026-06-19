/* ============================================================
   formula-info.ts — Giải thích chi tiết công thức z = f(x, y)
   Có sẵn nội dung curated cho các preset; công thức tuỳ chỉnh
   sẽ được phân tích heuristic (đối xứng, tuần hoàn, miền xác định…).
   ============================================================ */

export interface FormulaInfo {
  title: string;
  summary: string;
  tags: string[];
  details: string[];
}

const norm = (f: string) => f.replace(/\s+/g, '').toLowerCase();

const RIPPLE: FormulaInfo = {
  title: 'Sóng sinc lan toả',
  summary: 'Hàm sinc theo bán kính: sin(r) / r, với r = √(x² + y²).',
  tags: ['Đối xứng tròn', 'Dao động tắt dần', 'Cực đại tại tâm'],
  details: [
    'r = √(x² + y²) là khoảng cách tới gốc → hàm chỉ phụ thuộc r ⇒ đối xứng quay quanh trục đứng.',
    'Tại tâm (r → 0) giá trị tiến tới 1 (giới hạn nổi tiếng sin(r)/r → 1).',
    'Càng ra xa, sin(r) dao động trong khi 1/r làm biên độ giảm dần ⇒ các gợn sóng đồng tâm thấp dần.',
    'Mô hình hoá sóng nước / nhiễu xạ lan ra từ một điểm nguồn.',
  ],
};

const CURATED: Record<string, FormulaInfo> = {
  'sin(sqrt(x^2+y^2))/(sqrt(x^2+y^2))': RIPPLE,
  'sin(sqrt(x^2+y^2))/sqrt(x^2+y^2)': RIPPLE,
  'sin(x)*cos(y)': {
    title: 'Lưới đồi – thung lũng',
    summary: 'Tích hai dao động vuông góc: sin(x) · cos(y).',
    tags: ['Tuần hoàn 2π', 'Đỉnh/đáy xen kẽ', 'Tách biến'],
    details: [
      'Là tích của sin(x) (theo x) và cos(y) (theo y) ⇒ tuần hoàn chu kỳ 2π theo cả hai trục.',
      'Tạo mảng đồi và thung lũng xen kẽ kiểu bàn cờ; giá trị đổi dấu khi qua mỗi nửa chu kỳ.',
      'Biên độ luôn nằm trong khoảng [-1, 1].',
    ],
  },
  '0.1*(x^2+y^2)': {
    title: 'Chảo parabol (paraboloid)',
    summary: 'Mặt bậc hai tròn xoay: z = 0.1 · (x² + y²) = 0.1 · r².',
    tags: ['Lồi', 'Đối xứng tròn', 'Một cực tiểu'],
    details: [
      'z tỉ lệ với bình phương bán kính r ⇒ mặt cong lên thành cái bát (paraboloid tròn xoay).',
      'Độ dốc (gradient) tăng tuyến tính theo r: càng xa tâm mặt càng dốc.',
      'Có duy nhất một cực tiểu tại gốc (0, 0); hàm lồi (convex).',
    ],
  },
  'sin(x*0.5)+cos(y*0.5)': {
    title: 'Sóng giao thoa',
    summary: 'Tổng hai sóng độc lập: sin(0.5x) + cos(0.5y).',
    tags: ['Tuần hoàn 4π', 'Không đối xứng tròn', 'Cộng sóng'],
    details: [
      'Là tổng (không phải tích) của một sóng theo x và một sóng theo y, mỗi sóng chu kỳ 4π (do hệ số 0.5).',
      'Tạo gợn sóng chéo nhau — mặt là sự chồng chập (superposition) của hai sóng phẳng vuông góc.',
      'Biên độ nằm trong khoảng [-2, 2].',
    ],
  },
};

/** Phân tích heuristic cho công thức tuỳ chỉnh. */
function analyze(formula: string): FormulaInfo {
  const n = norm(formula);
  const tags: string[] = [];
  const details: string[] = [];

  const hasX = /(^|[^a-z])x([^a-z]|$)/.test(n);
  const hasY = /(^|[^a-z])y([^a-z]|$)/.test(n);

  if (/sin|cos|tan/.test(n)) {
    tags.push('Tuần hoàn / dao động');
    details.push('Chứa hàm lượng giác ⇒ mặt dao động lên xuống có tính tuần hoàn.');
  }
  if (n.includes('sqrt(x^2+y^2)') || n.includes('x^2+y^2')) {
    tags.push('Đối xứng tròn');
    details.push('Phụ thuộc bán kính r = √(x² + y²) ⇒ đối xứng quay quanh trục đứng.');
  } else if (/x\^2/.test(n) && /y\^2/.test(n)) {
    tags.push('Dạng bậc hai');
    details.push('Có số hạng bình phương theo cả x và y ⇒ mặt cong dạng parabol hoặc yên ngựa (saddle).');
  }
  if (/exp/.test(n)) details.push('Có hàm mũ exp ⇒ giá trị tăng/giảm rất nhanh.');
  if (/log/.test(n)) details.push('Có log ⇒ chú ý miền xác định: đối số của log phải > 0.');
  if (/abs|\|/.test(n)) {
    tags.push('Không trơn');
    details.push('Có giá trị tuyệt đối ⇒ xuất hiện cạnh gấp (không khả vi tại đó).');
  }
  if (hasX && !hasY) {
    tags.push('Mặt trụ theo y');
    details.push('Không chứa y ⇒ mặt là một "máng" có dạng cố định, kéo dài theo trục y.');
  } else if (hasY && !hasX) {
    tags.push('Mặt trụ theo x');
    details.push('Không chứa x ⇒ mặt là một "máng" có dạng cố định, kéo dài theo trục x.');
  }
  if (details.length === 0) {
    details.push('Mặt z = f(x, y) được lấy mẫu trên lưới rồi dựng thành các tam giác để hiển thị.');
  }

  return {
    title: 'Công thức tuỳ chỉnh',
    summary: `z = ${formula}`,
    tags,
    details,
  };
}

export function explainFormula(formula: string): FormulaInfo {
  return CURATED[norm(formula)] ?? analyze(formula);
}
