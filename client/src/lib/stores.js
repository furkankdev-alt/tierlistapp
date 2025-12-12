import { writable } from 'svelte/store';

export const language = writable('EN');

export const translations = {
	EN: {
		tierLists: 'Tier List',
		drafting: 'Draft',
		new: 'New',
		editTiers: 'Edit Tiers',
		highlighter: 'Highlighter',
		reset: 'Reset',
		erase: 'Erase',
		searchChampions: 'Search champions...',
		blueSide: 'BLUE SIDE',
		redSide: 'RED SIDE',
		addTier: '+ Add Tier',
		clickToHighlight: 'Click a champion to highlight it.',
		editTierList: 'Edit Tier List',
		highlighterPanel: 'Highlighter',
		championTierList: 'Champion Tier List',
		customColors: 'Custom Colors',
		customColor: 'Custom Color',
		bluePrefix: 'B',
		redPrefix: 'R'
	},
	KR: {
		tierLists: 'Tier List',
		drafting: 'Draft',
		new: '새로 만들기',
		editTiers: '티어 편집',
		highlighter: '하이라이터',
		reset: '초기화',
		erase: '지우개',
		searchChampions: '챔피언 검색...',
		blueSide: '블루 팀',
		redSide: '레드 팀',
		addTier: '+ 티어 추가',
		clickToHighlight: '챔피언을 클릭하여 강조 표시하세요.',
		editTierList: '티어 리스트 편집',
		highlighterPanel: '하이라이터',
		championTierList: '챔피언 티어 리스트',
		customColors: '커스텀 색상',
		customColor: '커스텀 색상',
		bluePrefix: 'B',
		redPrefix: 'R'
	},
	TR: {
		tierLists: 'Tier List',
		drafting: 'Draft',
		new: 'Yeni',
		editTiers: 'Tier Düzenle',
		highlighter: 'İşaretleyici',
		reset: 'Sıfırla',
		erase: 'Sil',
		searchChampions: 'Şampiyon ara...',
		blueSide: 'MAVİ TAKIM',
		redSide: 'KIRMIZI TAKIM',
		addTier: '+ Tier Ekle',
		clickToHighlight: 'Vurgulamak için bir şampiyona tıklayın.',
		editTierList: 'Tier Listesini Düzenle',
		highlighterPanel: 'İşaretleyici',
		championTierList: 'Şampiyon Tier List',
		customColors: 'Özel Renkler',
		customColor: 'Özel Renk',
		bluePrefix: 'M',
		redPrefix: 'K'
	}
};
