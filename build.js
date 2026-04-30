const fs = require('fs');
const path = require('path');

// ビルド日付（sitemap.xmlのlastmodに使用）
const today = new Date().toISOString().split('T')[0];

const routeConfig = {
    '/': {
        title: '波切カバン店 - 大切に、長く使う。職人の手による丁寧なカバン修理',
        description: '山梨県甲府市のカバン修理専門店「波切カバン店」。キャスター交換、ファスナー修理、持ち手交換など、職人が丁寧にお直しします。ブランドバッグの内張り修理も承ります。',
        keywords: 'カバン修理,山梨,甲府,キャスター交換,バッグ修理,財布修理,波切カバン店',
        ogTitle: '波切カバン店 - 職人の手による丁寧なカバン修理',
        ogDescription: '思い出の詰まった大切なカバン、職人の技術で蘇らせます。山梨県甲府市でカバン修理ならお任せください。',
        priority: '1.0',
    },
    '/pricing': {
        title: '修理メニュー・料金 | 波切カバン店',
        description: 'キャスター交換、ファスナー修理、持ち手交換、内張り張替えなど、波切カバン店の修理メニューと概算料金をご案内します。ブランドバッグや財布の修理にも対応しています。',
        keywords: '修理料金,メニュー,キャスター交換 料金,ファスナー修理 料金,内張り張替え,波切カバン店',
        ogTitle: '修理メニュー・料金 | 波切カバン店',
        ogDescription: 'キャスター交換、ファスナー修理、持ち手交換、内張り張替えなど、波切カバン店の修理メニューと概算料金をご案内します。',
        priority: '0.8',
    },
    '/repair-flow': {
        title: '修理の流れ | 波切カバン店',
        description: '波切カバン店でのカバン修理の流れをご紹介します。お持ち込みからお見積もり、修理作業、完了・お渡しまで、安心してお任せいただけるよう丁寧に対応いたします。',
        keywords: '修理の流れ,見積もり無料,カバン修理 期間,依頼方法,波切カバン店',
        ogTitle: '修理の流れ | 波切カバン店',
        ogDescription: '波切カバン店でのカバン修理の流れをご紹介します。お見積もり無料で安心してお任せいただけます。',
        priority: '0.7',
    },
    '/faq': {
        title: 'よくあるご質問 | 波切カバン店',
        description: 'カバン修理に関するよくあるご質問（FAQ）にお答えします。修理期間や無料見積もり、他店で断られたカバンの修理、ハイブランド対応についてなど、疑問を解決します。',
        keywords: 'よくあるご質問,FAQ,修理期間,見積もり,ハイブランド修理,波切カバン店',
        ogTitle: 'よくあるご質問 | 波切カバン店',
        ogDescription: 'カバン修理に関するよくあるご質問（FAQ）にお答えします。修理期間や無料見積もりについて。',
        priority: '0.8',
        // 案A: FAQPage構造化データ
        extraJsonLd: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "どんなものが直せますか？",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "カバン・バッグ類全般の修理に対応しています。ファスナー・チャックの交換、持ち手・肩ひもの修理・交換、キャスター（車輪）の交換、内張りの張り替え、錠前の交換、縫い直し・補強など、幅広くお受けしています。まずはお気軽にお電話にてご相談ください。"
                    }
                },
                {
                    "@type": "Question",
                    "name": "修理の期間はどのぐらいかかりますか？",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "修理の内容によって異なります。簡単なものであれば1週間程度、内張りの張り替えや複雑な作業の場合は2〜4週間程度が目安です。混み具合によっても変わりますので、詳しくはお電話にてご相談ください。"
                    }
                },
                {
                    "@type": "Question",
                    "name": "見積もりは無料ですか？",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "はい、お見積もりは完全に無料です。修理品をお持ちいただければ、職人がその場で状態を確認し、概算の金額をお伝えします。内容にご納得いただけない場合、料金は一切かかりませんのでご安心ください。"
                    }
                },
                {
                    "@type": "Question",
                    "name": "遠方から郵送で修理をお願いできますか？",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "基本的にはご来店をお願いしておりますが、遠方でどうしてもお越しいただくのが難しい場合は、まずはお電話にてご相談ください。修理箇所の写真を確認させていただくなどして、郵送での対応が可能か判断させていただきます。"
                    }
                },
                {
                    "@type": "Question",
                    "name": "ハイブランドのカバンでも修理してもらえますか？",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "ハイブランドの製品は特殊な製法や部材が使用されていることが多いため、修理内容によってはお受けできない場合や、仕上がりに制限が出る場合がございます。職人が一点ずつ状態を確認し、可能な範囲で最善の対応をご提案させていただきます。"
                    }
                },
                {
                    "@type": "Question",
                    "name": "他のお店で断られたのですが、修理を引き受けていただけますか？",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "他店で断られてご来店いただく方も多くいらっしゃいます。これまでの実績では、修理可能な場合が多くありました。まずはお電話またはご来店の上、ご相談ください。"
                    }
                },
                {
                    "@type": "Question",
                    "name": "大切なカバンなので、修理後の仕上がりが気になります",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "修理を行う前に、仕上がりについてのご要望をお気軽にお申し付けください。なるべくご希望に沿う形で修理いたします。また、修理が完成した際には引き渡し前にご確認いただくことも可能です。"
                    }
                }
            ]
        }, null, 2)
    },
    '/voices': {
        title: 'お客様の声 | 波切カバン店',
        description: '波切カバン店をご利用いただいたお客様からの声や修理事例をご紹介します。キャスター交換やブランドバッグ修理など、確かな技術でご満足いただいた感想をご覧ください。',
        keywords: 'お客様の声,修理事例,クチコミ,評判,持ち手交換,波切カバン店',
        ogTitle: 'お客様の声 | 波切カバン店',
        ogDescription: '波切カバン店をご利用いただいたお客様からの声や修理事例をご紹介します。確かな技術でご満足いただいた感想をご覧ください。',
        priority: '0.7',
    },
    '/store-info': {
        title: '店舗情報 | 波切カバン店',
        description: '山梨県甲府市にある波切カバン店の店舗情報、営業時間、アクセス、駐車場のご案内です。店主からのご挨拶や、Googleマップでの経路もご確認いただけます。',
        keywords: '店舗情報,アクセス,駐車場,営業時間,甲府市 カバン修理,波切カバン店',
        ogTitle: '店舗情報 | 波切カバン店',
        ogDescription: '山梨県甲府市にある波切カバン店の店舗情報、営業時間、アクセス、駐車場のご案内です。',
        priority: '0.8',
    }
};

const baseUrl = 'https://xn--lckxdven68lsenehu.com';
const templatePath = path.join(__dirname, 'index.html');

try {
    const templateHtml = fs.readFileSync(templatePath, 'utf-8');

    for (const [routePath, config] of Object.entries(routeConfig)) {
        if (routePath === '/') continue; // ルートはindex.htmlをそのまま使用

        const fullUrl = `${baseUrl}${routePath}`;

        let newHtml = templateHtml
            .replace(/<title>.*?<\/title>/, `<title>${config.title}</title>`)
            .replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${config.description}">`)
            .replace(/<meta name="keywords" content=".*?">/, `<meta name="keywords" content="${config.keywords}">`)
            .replace(/<meta property="og:title" content=".*?">/, `<meta property="og:title" content="${config.ogTitle}">`)
            .replace(/<meta property="og:description" content=".*?">/, `<meta property="og:description" content="${config.ogDescription}">`)
            .replace(/<meta property="og:url" content=".*?">/, `<meta property="og:url" content="${fullUrl}">`)
            .replace(/<link rel="canonical" href=".*?">/, `<link rel="canonical" href="${fullUrl}">`);

        // 案A: FAQPage構造化データがある場合、</head>の直前に挿入
        if (config.extraJsonLd) {
            const faqJsonLdTag = `    <script type="application/ld+json">\n${config.extraJsonLd}\n    </script>\n</head>`;
            newHtml = newHtml.replace(/<\/head>/, faqJsonLdTag);
        }

        // Create directory
        const dirPath = path.join(__dirname, routePath.substring(1));
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        // Write index.html inside the directory
        const outPath = path.join(dirPath, 'index.html');
        fs.writeFileSync(outPath, newHtml);
        console.log(`Generated ${outPath}`);
    }

    // 案C: sitemap.xml を今日の日付で自動更新
    const sitemapPath = path.join(__dirname, 'sitemap.xml');
    const sitemapUrls = Object.entries(routeConfig).map(([routePath, config]) => {
        const loc = routePath === '/' ? baseUrl + '/' : `${baseUrl}${routePath}`;
        return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${config.priority}</priority>\n  </url>`;
    }).join('\n');

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`;
    fs.writeFileSync(sitemapPath, sitemapContent);
    console.log(`Updated sitemap.xml (lastmod: ${today})`);

    console.log('Build completed successfully.');
} catch (error) {
    console.error('Build failed:', error);
}
