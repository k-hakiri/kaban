const fs = require('fs');
const path = require('path');

const routeConfig = {
    '/': {
        title: '波切カバン店 - 大切に、長く使う。職人の手による丁寧なカバン修理',
        description: '山梨県甲府市のカバン修理専門店「波切カバン店」。キャスター交換、ファスナー修理、持ち手交換など、職人が丁寧にお直しします。ブランドバッグの内張り修理も承ります。',
        keywords: 'カバン修理,山梨,甲府,キャスター交換,バッグ修理,財布修理,波切カバン店',
        ogTitle: '波切カバン店 - 職人の手による丁寧なカバン修理',
        ogDescription: '思い出の詰まった大切なカバン、職人の技術で蘇らせます。山梨県甲府市でカバン修理ならお任せください。',
    },
    '/pricing': {
        title: '修理メニュー・料金 | 波切カバン店',
        description: 'キャスター交換、ファスナー修理、持ち手交換、内張り張替えなど、波切カバン店の修理メニューと概算料金をご案内します。ブランドバッグや財布の修理にも対応しています。',
        keywords: '修理料金,メニュー,キャスター交換 料金,ファスナー修理 料金,内張り張替え,波切カバン店',
        ogTitle: '修理メニュー・料金 | 波切カバン店',
        ogDescription: 'キャスター交換、ファスナー修理、持ち手交換、内張り張替えなど、波切カバン店の修理メニューと概算料金をご案内します。',
    },
    '/repair-flow': {
        title: '修理の流れ | 波切カバン店',
        description: '波切カバン店でのカバン修理の流れをご紹介します。お持ち込みからお見積もり、修理作業、完了・お渡しまで、安心してお任せいただけるよう丁寧に対応いたします。',
        keywords: '修理の流れ,見積もり無料,カバン修理 期間,依頼方法,波切カバン店',
        ogTitle: '修理の流れ | 波切カバン店',
        ogDescription: '波切カバン店でのカバン修理の流れをご紹介します。お見積もり無料で安心してお任せいただけます。',
    },
    '/faq': {
        title: 'よくあるご質問 | 波切カバン店',
        description: 'カバン修理に関するよくあるご質問（FAQ）にお答えします。修理期間や無料見積もり、他店で断られたカバンの修理、ハイブランド対応についてなど、疑問を解決します。',
        keywords: 'よくあるご質問,FAQ,修理期間,見積もり,ハイブランド修理,波切カバン店',
        ogTitle: 'よくあるご質問 | 波切カバン店',
        ogDescription: 'カバン修理に関するよくあるご質問（FAQ）にお答えします。修理期間や無料見積もりについて。',
    },
    '/voices': {
        title: 'お客様の声 | 波切カバン店',
        description: '波切カバン店をご利用いただいたお客様からの声や修理事例をご紹介します。キャスター交換やブランドバッグ修理など、確かな技術でご満足いただいた感想をご覧ください。',
        keywords: 'お客様の声,修理事例,クチコミ,評判,持ち手交換,波切カバン店',
        ogTitle: 'お客様の声 | 波切カバン店',
        ogDescription: '波切カバン店をご利用いただいたお客様からの声や修理事例をご紹介します。確かな技術でご満足いただいた感想をご覧ください。',
    },
    '/store-info': {
        title: '店舗情報 | 波切カバン店',
        description: '山梨県甲府市にある波切カバン店の店舗情報、営業時間、アクセス、駐車場のご案内です。店主からのご挨拶や、Googleマップでの経路もご確認いただけます。',
        keywords: '店舗情報,アクセス,駐車場,営業時間,甲府市 カバン修理,波切カバン店',
        ogTitle: '店舗情報 | 波切カバン店',
        ogDescription: '山梨県甲府市にある波切カバン店の店舗情報、営業時間、アクセス、駐車場のご案内です。',
    }
};

const baseUrl = 'https://xn--lckxdven68lsenehu.com';
const templatePath = path.join(__dirname, 'index.html');

try {
    const templateHtml = fs.readFileSync(templatePath, 'utf-8');

    for (const [routePath, config] of Object.entries(routeConfig)) {
        if (routePath === '/') continue; // Skip root, we keep the original index.html as is for the root

        const fullUrl = `${baseUrl}${routePath}`;
        
        let newHtml = templateHtml
            .replace(/<title>.*?<\/title>/, `<title>${config.title}</title>`)
            .replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${config.description}">`)
            .replace(/<meta name="keywords" content=".*?">/, `<meta name="keywords" content="${config.keywords}">`)
            .replace(/<meta property="og:title" content=".*?">/, `<meta property="og:title" content="${config.ogTitle}">`)
            .replace(/<meta property="og:description" content=".*?">/, `<meta property="og:description" content="${config.ogDescription}">`)
            .replace(/<meta property="og:url" content=".*?">/, `<meta property="og:url" content="${fullUrl}">`)
            .replace(/<link rel="canonical" href=".*?">/, `<link rel="canonical" href="${fullUrl}">`);

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
    console.log('Build completed successfully.');
} catch (error) {
    console.error('Build failed:', error);
}
