-- =============================================
-- Tafarud Store - بيانات تجريبية
-- شغّل هذا الملف في Supabase SQL Editor بعد إنشاء الجداول
-- =============================================

-- إضافة عمود معرض الصور (اختياري)
ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery_urls TEXT[] DEFAULT '{}';

-- =============================================
-- الأقسام (التصنيفات)
-- =============================================
INSERT INTO categories (id, name_ar, name_en, slug, image_url) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'أدب وروايات', 'Literature & Novels', 'literature-novels', NULL),
  ('a1000000-0000-0000-0000-000000000002', 'تنمية ذاتية', 'Self Development', 'self-development', NULL),
  ('a1000000-0000-0000-0000-000000000003', 'فكر وفلسفة', 'Thought & Philosophy', 'thought-philosophy', NULL),
  ('a1000000-0000-0000-0000-000000000004', 'تاريخ وحضارة', 'History & Civilization', 'history-civilization', NULL),
  ('a1000000-0000-0000-0000-000000000005', 'كتب أطفال', 'Children Books', 'children-books', NULL),
  ('a1000000-0000-0000-0000-000000000006', 'دين وإسلاميات', 'Religion & Islamic', 'religion-islamic', NULL)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- المنتجات (الكتب)
-- =============================================

-- أدب وروايات
INSERT INTO products (name_ar, name_en, description_ar, description_en, price, category_id, featured, image_url) VALUES
(
  'ظلال الروح',
  'Shadows of the Soul',
  'رواية أدبية تغوص في أعماق النفس البشرية وتستكشف العلاقة بين الإنسان وذاته، عبر رحلة بطل يبحث عن معنى الحياة في عالم مليء بالتناقضات.',
  'A literary novel that dives deep into the human psyche, exploring the relationship between a person and their inner self through a hero''s journey seeking the meaning of life.',
  45.00,
  'a1000000-0000-0000-0000-000000000001',
  TRUE,
  NULL
),
(
  'آخر الليل',
  'End of the Night',
  'مجموعة قصص قصيرة تجمع بين الواقعية والخيال، تتناول حكايات من الحياة اليومية بأسلوب أدبي مشوّق ولغة عربية رشيقة.',
  'A collection of short stories blending realism and imagination, telling tales from everyday life with an engaging literary style.',
  35.00,
  'a1000000-0000-0000-0000-000000000001',
  FALSE,
  NULL
),
(
  'حديقة الغروب',
  'The Sunset Garden',
  'رواية رومانسية تدور أحداثها في مدينة عربية قديمة، حيث تتشابك خيوط الحب والفقد والأمل في نسيج درامي مؤثر.',
  'A romantic novel set in an old Arab city, where threads of love, loss, and hope intertwine in a moving dramatic tapestry.',
  50.00,
  'a1000000-0000-0000-0000-000000000001',
  TRUE,
  NULL
),

-- تنمية ذاتية
(
  'قوة البداية',
  'The Power of Beginning',
  'كتاب يرشدك إلى كيفية التغلب على التردد والخوف من البدايات الجديدة، مع تمارين عملية وقصص ملهمة من حياة الناجحين.',
  'A guide to overcoming hesitation and fear of new beginnings, with practical exercises and inspiring stories from successful people.',
  40.00,
  'a1000000-0000-0000-0000-000000000002',
  TRUE,
  NULL
),
(
  'عادات النجاح اليومية',
  'Daily Success Habits',
  'دليل شامل لبناء عادات إيجابية تقودك نحو النجاح، يعتمد على أحدث الأبحاث في علم النفس السلوكي والتطوير الشخصي.',
  'A comprehensive guide to building positive habits that lead to success, based on the latest research in behavioral psychology.',
  38.00,
  'a1000000-0000-0000-0000-000000000002',
  FALSE,
  NULL
),
(
  'فن الإقناع',
  'The Art of Persuasion',
  'كتاب يكشف أسرار التأثير والإقناع في الحياة المهنية والشخصية، مع أمثلة واقعية وتقنيات مجربة.',
  'A book revealing the secrets of influence and persuasion in professional and personal life, with real examples and proven techniques.',
  42.00,
  'a1000000-0000-0000-0000-000000000002',
  FALSE,
  NULL
),

-- فكر وفلسفة
(
  'تأملات في الوجود',
  'Reflections on Existence',
  'دراسة فلسفية معمقة تطرح أسئلة جوهرية حول الوجود والمعنى والحرية، مستلهمة من التراث الفكري العربي والإسلامي.',
  'A deep philosophical study posing fundamental questions about existence, meaning, and freedom, inspired by Arab and Islamic intellectual heritage.',
  55.00,
  'a1000000-0000-0000-0000-000000000003',
  TRUE,
  NULL
),
(
  'العقل والنقل',
  'Reason and Tradition',
  'كتاب يستعرض العلاقة بين العقل والنص في الفكر الإسلامي، ويناقش إشكاليات التوفيق بين المعرفة العقلية والنقلية.',
  'A book exploring the relationship between reason and text in Islamic thought, discussing the challenges of reconciling rational and traditional knowledge.',
  48.00,
  'a1000000-0000-0000-0000-000000000003',
  FALSE,
  NULL
),

-- تاريخ وحضارة
(
  'حضارات منسية',
  'Forgotten Civilizations',
  'رحلة تاريخية ممتعة عبر حضارات عربية قديمة لم تنل حقها من الاهتمام، مع صور ورسومات توضيحية فريدة.',
  'An enjoyable historical journey through ancient Arab civilizations that haven''t received their due attention, with unique illustrations.',
  60.00,
  'a1000000-0000-0000-0000-000000000004',
  TRUE,
  NULL
),
(
  'طريق الحرير العربي',
  'The Arab Silk Road',
  'كتاب يوثق دور العرب المحوري في طريق الحرير التجاري وتأثيرهم في الحضارات الممتدة من الشرق إلى الغرب.',
  'A book documenting the pivotal role of Arabs in the Silk Road trade and their influence on civilizations from East to West.',
  52.00,
  'a1000000-0000-0000-0000-000000000004',
  FALSE,
  NULL
),

-- كتب أطفال
(
  'مغامرات سمسم',
  'Simsim Adventures',
  'سلسلة قصص مصورة للأطفال تتبع مغامرات الطفل سمسم في استكشاف العالم من حوله، مليئة بالألوان والدروس القيّمة.',
  'An illustrated story series for children following Simsim''s adventures exploring the world, full of colors and valuable lessons.',
  25.00,
  'a1000000-0000-0000-0000-000000000005',
  TRUE,
  NULL
),
(
  'حروفي الجميلة',
  'My Beautiful Letters',
  'كتاب تعليمي تفاعلي يساعد الأطفال على تعلم الحروف العربية بطريقة ممتعة من خلال الأنشطة والتلوين والألعاب.',
  'An interactive educational book helping children learn Arabic letters in a fun way through activities, coloring, and games.',
  20.00,
  'a1000000-0000-0000-0000-000000000005',
  FALSE,
  NULL
),

-- دين وإسلاميات
(
  'رحلة اليقين',
  'Journey of Certainty',
  'كتاب إيماني يتناول قصص الأنبياء والصالحين بأسلوب أدبي معاصر، يعزز الإيمان ويغذي الروح.',
  'A faith-based book covering stories of prophets and righteous people in a contemporary literary style, strengthening faith and nourishing the soul.',
  30.00,
  'a1000000-0000-0000-0000-000000000006',
  FALSE,
  NULL
),
(
  'أخلاقنا',
  'Our Ethics',
  'كتاب شامل يستعرض منظومة الأخلاق في الإسلام وتطبيقاتها العملية في الحياة اليومية المعاصرة.',
  'A comprehensive book reviewing the system of ethics in Islam and its practical applications in contemporary daily life.',
  35.00,
  'a1000000-0000-0000-0000-000000000006',
  TRUE,
  NULL
);

-- =============================================
-- روابط شراء تجريبية (للمنتجات المميزة)
-- =============================================
INSERT INTO purchase_links (product_id, platform_name, url, country_code, is_enabled, sort_order)
SELECT p.id, 'أمازون', 'https://amazon.ae', 'AE', TRUE, 1
FROM products p WHERE p.featured = TRUE;

INSERT INTO purchase_links (product_id, platform_name, url, country_code, is_enabled, sort_order)
SELECT p.id, 'نيل وفرات', 'https://neelwafurat.com', 'LB', TRUE, 2
FROM products p WHERE p.featured = TRUE;

-- =============================================
-- تم! يمكنك الآن تصفح المتجر ورؤية البيانات التجريبية
-- =============================================
