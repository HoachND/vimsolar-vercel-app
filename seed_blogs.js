const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_83tbClFSLvmn@ep-patient-voice-aqutbb2b-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require',
});

const posts = [
  {
    id: "blog_1_" + Date.now(),
    slug: "chi-phi-lap-dat-dien-mat-troi-ap-mai-ho-gia-dinh-2026",
    titleVi: "Báo Giá Chi Phí Lắp Đặt Điện Mặt Trời Áp Mái Cho Hộ Gia Đình 2026",
    titleEn: "2026 Rooftop Solar Panel Installation Cost for Homes",
    excerptVi: "Tìm hiểu chi tiết báo giá chi phí lắp đặt điện mặt trời áp mái trọn gói cho hộ gia đình năm 2026. Cập nhật mới nhất giá các hệ thống 3kW, 5kW và 10kW.",
    excerptEn: "Discover the complete cost of installing rooftop solar panels for households in 2026. Latest prices for 3kW, 5kW, and 10kW systems from VimSolar.",
    contentVi: "<h2>1. Tại sao năm 2026 là thời điểm vàng để lắp điện mặt trời áp mái?</h2><p>Giá điện ngày càng có xu hướng tăng, trong khi chi phí công nghệ tấm pin và inverter đang ở mức tốt nhất trong vòng 10 năm qua. Lắp đặt điện mặt trời áp mái (rooftop solar) giúp các hộ gia đình tự chủ năng lượng, giảm tới 90% hóa đơn tiền điện mỗi tháng và góp phần bảo vệ môi trường.</p><h2>2. Báo giá chi phí lắp điện mặt trời theo công suất (Tham khảo)</h2><p>Chi phí trọn gói (EPC) phụ thuộc vào công suất hệ thống (kWp) và cấu hình thiết bị mà gia đình lựa chọn.</p><h3>Hệ thống 3kWp</h3><p>Thích hợp cho gia đình có hóa đơn tiền điện từ 1 - 1.5 triệu/tháng. Chi phí đầu tư trọn gói dao động khoảng 35 - 45 triệu VNĐ.</p><h3>Hệ thống 5kWp</h3><p>Dành cho hóa đơn từ 1.5 - 2.5 triệu/tháng. Chi phí từ 55 - 70 triệu VNĐ. Đây là cấu hình hệ thống được nhiều gia đình lựa chọn nhất hiện nay.</p><h3>Hệ thống 10kWp</h3><p>Dành cho các căn biệt thự, nhà có hóa đơn điện trên 3 triệu/tháng hoặc có sử dụng nhiều thiết bị tốn điện. Chi phí khoảng 110 - 130 triệu VNĐ.</p><h2>3. Các thành phần quyết định giá thành hệ thống điện mặt trời</h2><ul><li><strong>Tấm pin (Solar Panels):</strong> Các thương hiệu Tier 1 như Canadian Solar, Jinko, Longi... chiếm khoảng 45% tổng chi phí.</li><li><strong>Bộ biến tần (Inverter):</strong> Growatt, Huawei, SMA... được ví như 'trái tim' của hệ thống, chiếm 20% chi phí.</li><li><strong>Hệ thống khung giá đỡ và phụ kiện:</strong> Đảm bảo hệ thống chống chịu được gió bão, bền bỉ trong suốt 25 năm.</li></ul>",
    contentEn: "<h2>1. Why is 2026 the golden time to install rooftop solar?</h2><p>Electricity prices are trending upwards, while the cost of solar panel and inverter technology is at its best in the past decade. Installing rooftop solar helps households achieve energy independence, reduce monthly electricity bills by up to 90%, and protect the environment.</p><h2>2. Solar Installation Cost Quotes by Capacity (Reference)</h2><p>The total EPC cost depends on the system capacity (kWp) and the equipment configuration chosen by the family.</p><h3>3kWp System</h3><p>Suitable for families with monthly electricity bills from 1 - 1.5 million VND. The total investment cost ranges from 35 - 45 million VND.</p><h3>5kWp System</h3><p>For bills from 1.5 - 2.5 million VND. Costs range from 55 - 70 million VND. This is the most popular system configuration today.</p><h3>10kWp System</h3><p>For villas or houses with electricity bills over 3 million VND/month or those using many high-power appliances. The cost is about 110 - 130 million VND.</p><h2>3. Components that Determine the Price of a Solar System</h2><ul><li><strong>Solar Panels:</strong> Tier 1 brands like Canadian Solar, Jinko, Longi... account for about 45% of the total cost.</li><li><strong>Inverter:</strong> Growatt, Huawei, SMA... are considered the 'heart' of the system, taking up 20% of the cost.</li><li><strong>Mounting Structure and Accessories:</strong> Ensuring the system withstands storms and remains durable for 25 years.</li></ul>",
    category: "Solar",
    seoTitle: "Chi Phí Lắp Đặt Điện Mặt Trời Áp Mái Cho Hộ Gia Đình 2026",
    seoDescription: "Tìm hiểu chi phí lắp đặt điện mặt trời áp mái cho hộ gia đình năm 2026. Bảng giá trọn gói EPC hệ thống 3kW, 5kW, 10kW. Giải pháp tiết kiệm 90% tiền điện.",
    seoImage: "/images/blog/blog1.png",
  },
  {
    id: "blog_2_" + Date.now(),
    slug: "he-thong-dien-mat-troi-hybrid-la-gi-co-nen-lap-khong",
    titleVi: "Hệ Thống Điện Mặt Trời Hybrid Là Gì? Có Nên Lắp Không?",
    titleEn: "What is a Hybrid Solar System? Should You Install One?",
    excerptVi: "Điện mặt trời Hybrid là gì? Khám phá cấu tạo, ưu nhược điểm và lý do hệ Hybrid đang là xu hướng hàng đầu để chống cúp điện.",
    excerptEn: "What is a Hybrid solar system? Explore the structure, pros and cons, and why Hybrid systems are the top trend for power outage protection.",
    contentVi: "<h2>1. Điện mặt trời Hybrid là gì?</h2><p>Điện mặt trời Hybrid là hệ thống kết hợp hoàn hảo giữa điện mặt trời hòa lưới (Grid-tied) và điện mặt trời độc lập (Off-grid). Hệ thống này sử dụng pin lưu trữ (Lithium) để dự trữ lượng điện năng dư thừa sinh ra vào ban ngày, nhằm cung cấp điện vào ban đêm hoặc ngay lập tức thay thế lưới điện những lúc cúp điện.</p><h2>2. Cấu tạo của hệ thống Solar Hybrid</h2><p>Ngoài tấm pin, hệ thống Hybrid cần có các thành phần đặc biệt sau:</p><ul><li><strong>Inverter Hybrid:</strong> Vừa hòa lưới lấy điện vào, vừa có khả năng điều tiết sạc/xả dòng điện vào pin lưu trữ thông minh.</li><li><strong>Pin lưu trữ (Battery Storage):</strong> Thường sử dụng công nghệ pin Lithium-ion tuổi thọ cao (bền bỉ hơn 10 năm) giúp tích trữ điện.</li></ul><h2>3. Ưu và nhược điểm của điện mặt trời Hybrid</h2><h3>Ưu điểm vượt trội:</h3><ul><li><strong>Không lo cúp điện:</strong> Tự động chuyển đổi sang nguồn điện dự phòng trong vài mili-giây, bảo vệ các thiết bị điện tử.</li><li><strong>Tối đa hóa tiết kiệm:</strong> Sử dụng điện từ pin lưu trữ vào ban đêm, không phải mua điện giá cao từ điện lưới.</li></ul><h3>Nhược điểm:</h3><p>Chi phí đầu tư ban đầu cao hơn hệ thống hòa lưới thông thường khoảng 40-50% do phải trang bị thêm bộ pin lưu trữ Lithium và Inverter Hybrid.</p>",
    contentEn: "<h2>1. What is a Hybrid Solar System?</h2><p>A Hybrid solar system perfectly combines grid-tied and off-grid solar systems. It uses battery storage (typically Lithium) to store excess electricity generated during the day to provide power at night or immediately replace the grid during power outages.</p><h2>2. Structure of a Hybrid Solar System</h2><p>Besides solar panels, a Hybrid system requires these special components:</p><ul><li><strong>Hybrid Inverter:</strong> Can both connect to the grid and intelligently manage the charging/discharging of the battery storage.</li><li><strong>Battery Storage:</strong> Usually employs long-life Lithium-ion battery technology (lasting over 10 years) to store electricity.</li></ul><h2>3. Pros and Cons of Hybrid Solar</h2><h3>Outstanding Advantages:</h3><ul><li><strong>No Fear of Power Outages:</strong> Automatically switches to backup power in milliseconds, protecting electronic devices.</li><li><strong>Maximize Savings:</strong> Use stored electricity at night, avoiding the need to buy expensive grid power.</li></ul><h3>Disadvantages:</h3><p>The initial investment cost is about 40-50% higher than a standard grid-tied system due to the added Lithium battery storage and Hybrid Inverter.</p>",
    category: "Solar",
    seoTitle: "Hệ Thống Điện Mặt Trời Hybrid Là Gì? Có Nên Lắp Không? | VimSolar",
    seoDescription: "Khám phá hệ thống điện mặt trời Hybrid là gì, nguyên lý hoạt động, cấu tạo và ưu điểm. Giải pháp dự trữ năng lượng, chống mất điện hoàn hảo cho gia đình.",
    seoImage: "/images/blog/blog2.png",
  },
  {
    id: "blog_3_" + Date.now(),
    slug: "lap-dien-mat-troi-bao-lau-thi-hoan-von",
    titleVi: "Lắp Điện Mặt Trời Bao Lâu Thì Hoàn Vốn? Cách Tính Nhanh Nhất",
    titleEn: "Solar Panel Payback Period: How Long Does It Take?",
    excerptVi: "Bạn đang băn khoăn về hiệu quả kinh tế? Xem ngay cách tính thời gian hoàn vốn khi lắp điện mặt trời áp mái chính xác nhất từ chuyên gia.",
    excerptEn: "Wondering about economic efficiency? See exactly how to calculate the payback period when installing rooftop solar panels from our experts.",
    contentVi: "<h2>1. Điện mặt trời - Kênh đầu tư sinh lời an toàn</h2><p>Việc lắp đặt điện mặt trời không chỉ là mua sắm tiêu dùng, mà là một khoản 'đầu tư' có tỷ suất sinh lời vô cùng hấp dẫn. Bạn bỏ vốn 1 lần và thu lợi nhuận thông qua việc 'cắt giảm tiền điện' mỗi tháng trong suốt vòng đời 25 năm của hệ thống.</p><h2>2. Thời gian hoàn vốn trung bình hiện nay</h2><p>Theo tính toán hàng ngàn dự án của VimSolar, thời gian hoàn vốn (ROI) hiện nay rơi vào khoảng:</p><ul><li><strong>Hộ gia đình:</strong> Khoảng 3.5 đến 5 năm.</li><li><strong>Doanh nghiệp, nhà xưởng:</strong> Khoảng 2.5 đến 4 năm (Do doanh nghiệp dùng nhiều điện ban ngày và chịu giá điện cao điểm).</li></ul><h2>3. Công thức tính thời gian hoàn vốn cơ bản</h2><p><strong>Thời gian hoàn vốn (năm) = Tổng chi phí đầu tư ban đầu / Tổng tiền điện tiết kiệm được trong 1 năm</strong></p><p><em>Ví dụ:</em> Bạn lắp hệ thống 5kWp giá 60 triệu VNĐ. Mỗi tháng giảm 1.5 triệu tiền điện (1 năm = 18 triệu). Thời gian hoàn vốn = 60 / 18 = <strong>3.3 năm</strong>. Nhanh chóng và vô cùng hiệu quả!</p>",
    contentEn: "<h2>1. Solar Power - A Safe Investment Channel</h2><p>Installing solar power is not just consumer spending, but an 'investment' with a highly attractive return rate. You invest once and profit by 'cutting electricity bills' every month throughout the system's 25-year lifespan.</p><h2>2. Current Average Payback Period</h2><p>Based on calculations from thousands of VimSolar projects, the Return on Investment (ROI) period currently is:</p><ul><li><strong>Households:</strong> About 3.5 to 5 years.</li><li><strong>Businesses and Factories:</strong> About 2.5 to 4 years (Because businesses use a lot of electricity during the day and face peak-hour pricing).</li></ul><h2>3. Basic Payback Period Calculation Formula</h2><p><strong>Payback Period (years) = Total Initial Investment Cost / Total Electricity Savings in 1 Year</strong></p><p><em>Example:</em> You install a 5kWp system for 60 million VND. It saves 1.5 million VND/month (1 year = 18 million). Payback period = 60 / 18 = <strong>3.3 years</strong>. Fast and highly effective!</p>",
    category: "Solar",
    seoTitle: "Lắp Điện Mặt Trời Bao Lâu Hoàn Vốn? Bài Toán Kinh Tế 2026",
    seoDescription: "Thời gian hoàn vốn điện mặt trời là bao lâu? Hướng dẫn cách tính chi phí đầu tư, tiền điện tiết kiệm mỗi tháng và ROI chính xác cho gia đình và nhà xưởng.",
    seoImage: "/images/blog/blog3.png",
  },
  {
    id: "blog_4_" + Date.now(),
    slug: "lap-dien-mat-troi-cho-doanh-nghiep-nha-xuong",
    titleVi: "Lắp Điện Mặt Trời Cho Doanh Nghiệp, Nhà Xưởng: Lợi Ích Kép Về Kinh Tế",
    titleEn: "Solar Power for Businesses and Factories: Dual Economic Benefits",
    excerptVi: "Giải pháp điện mặt trời mái nhà xưởng giúp doanh nghiệp cắt giảm chi phí vận hành, làm mát nhà xưởng và dễ dàng đạt chứng chỉ Xanh (ESG).",
    excerptEn: "Rooftop solar solutions help businesses cut operational costs, cool factories, and easily achieve Green Certificates (ESG).",
    contentVi: "<h2>1. Áp lực chi phí điện năng của doanh nghiệp</h2><p>Chi phí năng lượng luôn là bài toán đau đầu của cơ sở sản xuất. Việc giá điện liên tục điều chỉnh tăng khiến doanh nghiệp gặp khó khăn trong việc kiểm soát chi phí vận hành và cạnh tranh giá bán.</p><h2>2. Lợi ích khổng lồ khi doanh nghiệp lắp điện mặt trời</h2><h3>Cắt giảm chi phí điện cực kỳ hiệu quả</h3><p>Nhà xưởng thường hoạt động mạnh nhất vào ban ngày (từ 7h - 17h), trùng khớp hoàn toàn với thời điểm các tấm pin sinh ra nhiều điện nhất, giúp tránh được việc mua điện vào <strong>giờ cao điểm</strong> giá cao của EVN.</p><h3>Làm mát không gian nhà xưởng</h3><p>Việc phủ kín các tấm pin trên mái nhà sẽ tạo ra lớp cách nhiệt hoàn hảo. Nhiệt độ bên trong xưởng có thể giảm từ 3-5 độ C, giúp giảm chi phí điều hòa công nghiệp.</p><h3>Đạt chứng chỉ Xanh (ESG) - Giấy thông hành xuất khẩu</h3><p>Lắp điện mặt trời giúp doanh nghiệp giảm phát thải Carbon, đạt chứng chỉ xanh quốc tế. Đây là điều kiện bắt buộc để xuất khẩu sang Mỹ, Châu Âu.</p>",
    contentEn: "<h2>1. The Energy Cost Pressure on Businesses</h2><p>Energy costs are always a headache for manufacturing facilities. Continually rising electricity prices make it difficult for businesses to control operational costs and maintain competitive pricing.</p><h2>2. Massive Benefits of Installing Solar for Businesses</h2><h3>Highly Effective Electricity Cost Reduction</h3><p>Factories typically operate most intensively during the day (7 AM - 5 PM), perfectly coinciding with the time solar panels generate the most electricity. This helps avoid buying expensive <strong>peak-hour</strong> grid power.</p><h3>Cooling the Factory Space</h3><p>Covering the roof with solar panels creates a perfect insulation layer. Indoor factory temperatures can drop by 3-5 degrees Celsius, helping to reduce industrial cooling costs.</p><h3>Achieving Green Certificates (ESG) - Export Passport</h3><p>Installing solar helps businesses reduce carbon emissions and achieve international green certificates, a mandatory requirement for exporting to the US and Europe.</p>",
    category: "Solar",
    seoTitle: "Điện Mặt Trời Cho Doanh Nghiệp, Nhà Xưởng: Lợi Ích Kinh Tế",
    seoDescription: "Giải pháp điện mặt trời mái nhà xưởng giúp doanh nghiệp cắt giảm chi phí vận hành, làm mát xưởng, đạt chứng chỉ xanh (ESG) để nâng cao năng lực xuất khẩu.",
    seoImage: "/images/blog/blog4.png",
  },
  {
    id: "blog_5_" + Date.now(),
    slug: "huong-dan-ve-sinh-bao-duong-dien-mat-troi",
    titleVi: "Hướng Dẫn Vệ Sinh, Bảo Dưỡng Điện Mặt Trời Bền Bỉ 25 Năm",
    titleEn: "Solar Panel Cleaning & Maintenance Guide for a 25-Year Lifespan",
    excerptVi: "Khám phá cách vệ sinh tấm pin và bảo trì Inverter đúng kỹ thuật để hệ thống điện mặt trời đạt hiệu suất cao nhất và kéo dài tuổi thọ.",
    excerptEn: "Discover how to properly clean solar panels and maintain inverters to maximize system efficiency and extend lifespan up to 25 years.",
    contentVi: "<h2>1. Tại sao việc vệ sinh tấm pin mặt trời lại quan trọng?</h2><p>Bề mặt kính của tấm pin thường xuyên bị bám bụi bẩn, lá cây hay phân chim. Nếu để lớp bụi này quá dày, tấm pin sẽ không hấp thụ tối đa ánh sáng, gây suy giảm từ 10% - 25% sản lượng điện.</p><h2>2. Các nguyên tắc vệ sinh và bảo dưỡng an toàn</h2><h3>Vệ sinh bề mặt pin đúng cách</h3><p>Sử dụng chổi xoay chuyên dụng hoặc cây lau mềm với nước sạch. <strong>Tuyệt đối không:</strong> Dùng vòi xịt áp lực quá mạnh, hóa chất ăn mòn, hoặc vật cứng làm xước kính.</p><h3>Lựa chọn thời điểm vệ sinh</h3><p>Nên tiến hành vào <strong>sáng sớm</strong> hoặc <strong>chiều mát</strong>. Không dội nước lạnh vào tấm pin đang nóng giữa trưa để tránh nứt vỡ do sốc nhiệt.</p><h3>Kiểm tra bộ não Inverter</h3><p>Thường xuyên kiểm tra xem quạt tản nhiệt của Inverter có bị bụi bịt kín không. Quan sát các giắc cắm cáp DC/AC đảm bảo không bị lỏng lẻo gây chập cháy.</p>",
    contentEn: "<h2>1. Why is cleaning solar panels important?</h2><p>The glass surface of solar panels frequently accumulates dust, leaves, or bird droppings. If this layer gets too thick, the panel won't absorb maximum sunlight, causing a 10% - 25% drop in electricity output.</p><h2>2. Safe Cleaning and Maintenance Principles</h2><h3>Properly Cleaning the Panel Surface</h3><p>Use a specialized rotary brush or a soft mop with clean water. <strong>Strictly avoid:</strong> High-pressure washers, corrosive chemicals, or hard objects that scratch the glass.</p><h3>Choosing the Right Cleaning Time</h3><p>Cleaning should be done in the <strong>early morning</strong> or <strong>cool late afternoon</strong>. Do not pour cold water on blazing hot panels at noon to avoid thermal shock cracking.</p><h3>Checking the Inverter Brain</h3><p>Regularly check if the Inverter's cooling fan is blocked by dust. Inspect DC/AC cable connectors to ensure they are not loose, preventing fire hazards.</p>",
    category: "Solar",
    seoTitle: "Cách Vệ Sinh, Bảo Dưỡng Điện Mặt Trời Để Đạt Hiệu Suất Cao",
    seoDescription: "Khám phá cách vệ sinh và bảo dưỡng tấm pin mặt trời, inverter đúng kỹ thuật giúp hệ thống đạt hiệu suất cao nhất và kéo dài tuổi thọ lên tới 25 năm.",
    seoImage: "/images/blog/blog5.png",
  },
  {
    id: "blog_6_" + Date.now(),
    slug: "thu-tuc-dang-ky-lap-dat-dien-mat-troi-mai-nha-2026",
    titleVi: "Thủ Tục Đăng Ký Lắp Đặt Điện Mặt Trời Mái Nhà Mới Nhất 2026",
    titleEn: "Latest 2026 Registration Procedures for Installing Rooftop Solar",
    excerptVi: "Tìm hiểu chi tiết các bước làm thủ tục, hồ sơ xin phép EVN và cơ quan chức năng để lắp đặt điện mặt trời áp mái hợp lệ năm 2026.",
    excerptEn: "Learn about the detailed procedures and legal documents required to apply for rooftop solar installation with EVN quickly and legally in 2026.",
    contentVi: "<h2>1. Lắp điện mặt trời áp mái có cần xin phép không?</h2><p>Có. Hệ thống điện mặt trời theo mô hình <strong>'Tự sản, tự tiêu'</strong> tuy được nhà nước khuyến khích nhưng vẫn phải thực hiện các thủ tục thông báo và xin phép cơ bản với Điện lực và Sở Công Thương.</p><h2>2. Thủ tục đối với Hộ gia đình</h2><ol><li><strong>Thông báo:</strong> Gửi văn bản thông báo đến Sở Công Thương/Công ty Điện lực (EVN) địa phương.</li><li><strong>Chất lượng thiết bị:</strong> Inverter và Tấm pin phải có đầy đủ chứng chỉ chất lượng (CO, CQ).</li><li><strong>Cấu hình an toàn:</strong> Bắt buộc cài đặt chức năng 'Zero Export' (Bám tải) để ngăn việc đẩy ngược điện thừa lên lưới.</li></ol><h2>3. Thủ tục đối với Doanh nghiệp, Nhà xưởng</h2><ul><li><strong>PCCC:</strong> Hồ sơ thẩm duyệt bổ sung về an toàn Phòng cháy chữa cháy cho mái nhà xưởng.</li><li><strong>Kết cấu:</strong> Báo cáo kiểm định khả năng chịu lực của kết cấu mái tôn.</li><li><strong>Điện lực:</strong> Bản vẽ thiết kế điện, hồ sơ thỏa thuận đấu nối trạm biến áp.</li></ul>",
    contentEn: "<h2>1. Do you need a permit to install rooftop solar?</h2><p>Yes. Although <strong>'Self-production, self-consumption'</strong> solar systems are highly encouraged by the government, you still must complete basic notification and permitting procedures with the Power Company and the Department of Industry and Trade.</p><h2>2. Procedures for Households</h2><ol><li><strong>Notification:</strong> Send a written notice to the local Department of Industry and Trade/Power Company (EVN).</li><li><strong>Equipment Quality:</strong> Inverters and Panels must have full quality certificates (CO, CQ).</li><li><strong>Safety Configuration:</strong> It is mandatory to install the 'Zero Export' function to prevent excess electricity from being sent back to the grid.</li></ol><h2>3. Procedures for Businesses and Factories</h2><ul><li><strong>Fire Safety:</strong> Supplementary approval dossier for fire safety on the factory roof.</li><li><strong>Structure:</strong> Inspection report on the load-bearing capacity of the corrugated iron roof structure.</li><li><strong>Power Grid:</strong> Electrical design drawings, transformer connection agreement dossier.</li></ul>",
    category: "Solar",
    seoTitle: "Thủ Tục Xin Phép, Đăng Ký Lắp Điện Mặt Trời Mới Nhất 2026",
    seoDescription: "Tìm hiểu chi tiết thủ tục, giấy tờ pháp lý cần thiết để xin phép lắp đặt điện mặt trời áp mái với Điện lực (EVN) nhanh chóng và hợp lệ năm 2026.",
    seoImage: "/images/blog/blog6.png",
  }
];

async function seed() {
  const client = await pool.connect();
  try {
    for (const post of posts) {
      // Upsert by slug so we don't duplicate
      const check = await client.query('SELECT id FROM vimsolar_blogs WHERE slug = $1', [post.slug]);
      if (check.rowCount === 0) {
        await client.query(
          `INSERT INTO vimsolar_blogs (id, slug, title_vi, title_en, excerpt_vi, excerpt_en, content_vi, content_en, category, seo_title, seo_description, seo_image, tags, author, published)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
          [post.id, post.slug, post.titleVi, post.titleEn, post.excerptVi, post.excerptEn, post.contentVi, post.contentEn, post.category, post.seoTitle, post.seoDescription, post.seoImage, '[]', 'Admin VimSolar', true]
        );
      } else {
        await client.query(
          `UPDATE vimsolar_blogs SET seo_image = $1 WHERE slug = $2`,
          [post.seoImage, post.slug]
        );
      }
    }
    console.log("Seeding complete");
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
