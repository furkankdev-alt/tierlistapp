<script>
	import { onMount } from 'svelte';
	import { champions } from '$lib/champions.js';
	import { language, translations } from '$lib/stores.js';

	let currentLang = 'EN';
	language.subscribe(value => {
		currentLang = value;
	});
	$: t = translations[currentLang];

	let searchQuery = '';
	let selectedRoles = [];
	let activeSlot = null;
	let selectedChampion = null;
	let bannedChampions = new Set();
	let pickedChampions = new Set();

	let blueBans = [null, null, null, null, null];
	let redBans = [null, null, null, null, null];
	let bluePicks = [null, null, null, null, null];
	let redPicks = [null, null, null, null, null];

	const roles = [
		{ name: 'Top', id: 'top', icon: '/Top_icon.png' },
		{ name: 'Jungle', id: 'jungle', icon: '/Jungle_icon.png' },
		{ name: 'Mid', id: 'mid', icon: '/Middle_icon.png' },
		{ name: 'ADC', id: 'adc', icon: '/Bottom_icon.png' },
		{ name: 'Support', id: 'support', icon: '/Support_icon.png' }
	];

	$: filteredChampions = champions.filter((champ) => {
		const matchesSearch = champ.name.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesRole =
			selectedRoles.length === 0 || selectedRoles.some((role) => champ.roles.includes(role));
		const notDisabled = !bannedChampions.has(champ.id) && !pickedChampions.has(champ.id);
		return matchesSearch && matchesRole && notDisabled;
	});

	function selectRole(roleId, isRightClick = false) {
		if (isRightClick) {
			if (selectedRoles.includes(roleId)) {
				selectedRoles = selectedRoles.filter((r) => r !== roleId);
			} else {
				selectedRoles = [...selectedRoles, roleId];
			}
		} else {
			if (selectedRoles.length === 1 && selectedRoles[0] === roleId) {
				selectedRoles = [];
			} else {
				selectedRoles = [roleId];
			}
		}
	}

	function setActiveSlot(type, side, index) {
		if (selectedChampion) {
			activeSlot = { type, side, index };
			selectChampion(selectedChampion);
			selectedChampion = null;
		} else {
			activeSlot = { type, side, index };
		}
	}

	function selectChampion(champion) {
		if (!activeSlot) {
			selectedChampion = champion;
			return;
		}

		const { type, side, index } = activeSlot;

		if (type === 'ban') {
			if (side === 'blue') {
				blueBans[index] = champion;
				blueBans = [...blueBans];
			} else {
				redBans[index] = champion;
				redBans = [...redBans];
			}
			bannedChampions.add(champion.id);
		} else if (type === 'pick') {
			if (side === 'blue') {
				bluePicks[index] = champion;
				bluePicks = [...bluePicks];
			} else {
				redPicks[index] = champion;
				redPicks = [...redPicks];
			}
			pickedChampions.add(champion.id);
		}

		bannedChampions = new Set(bannedChampions);
		pickedChampions = new Set(pickedChampions);
		activeSlot = null;
		saveToLocalStorage();
	}

	function removeFromSlot(type, side, index) {
		let champion;

		if (type === 'ban') {
			if (side === 'blue') {
				champion = blueBans[index];
				blueBans[index] = null;
				blueBans = [...blueBans];
			} else {
				champion = redBans[index];
				redBans[index] = null;
				redBans = [...redBans];
			}
			if (champion) bannedChampions.delete(champion.id);
		} else if (type === 'pick') {
			if (side === 'blue') {
				champion = bluePicks[index];
				bluePicks[index] = null;
				bluePicks = [...bluePicks];
			} else {
				champion = redPicks[index];
				redPicks[index] = null;
				redPicks = [...redPicks];
			}
			if (champion) pickedChampions.delete(champion.id);
		}

		bannedChampions = new Set(bannedChampions);
		pickedChampions = new Set(pickedChampions);

		if (activeSlot?.type === type && activeSlot?.side === side && activeSlot?.index === index) {
			activeSlot = null;
		}

		saveToLocalStorage();
	}

	function resetDraft() {
		if (confirm('Are you sure you want to reset the draft?')) {
			blueBans = [null, null, null, null, null];
			redBans = [null, null, null, null, null];
			bluePicks = [null, null, null, null, null];
			redPicks = [null, null, null, null, null];
			bannedChampions = new Set();
			pickedChampions = new Set();
			activeSlot = null;
			selectedChampion = null;
			localStorage.removeItem('drafting-state');
		}
	}

	function saveToLocalStorage() {
		const state = {
			blueBans,
			redBans,
			bluePicks,
			redPicks,
			bannedChampions: Array.from(bannedChampions),
			pickedChampions: Array.from(pickedChampions)
		};
		localStorage.setItem('drafting-state', JSON.stringify(state));
	}

	function loadFromLocalStorage() {
		const saved = localStorage.getItem('drafting-state');
		if (saved) {
			const state = JSON.parse(saved);
			blueBans = state.blueBans || blueBans;
			redBans = state.redBans || redBans;
			bluePicks = state.bluePicks || bluePicks;
			redPicks = state.redPicks || redPicks;
			bannedChampions = new Set(state.bannedChampions || []);
			pickedChampions = new Set(state.pickedChampions || []);
		}
	}

	onMount(() => {
		loadFromLocalStorage();
	});
</script>

<div class="drafting-page">
	<!-- Top Navbar -->
	<div class="top-navbar">
		<button class="nav-btn" on:click={resetDraft}>
			{t.reset}
		</button>
	</div>

	<!-- Ban Section -->
	<div class="ban-section">
		<div class="team-header blue-header">{t.blueSide}</div>
		<div class="team-header red-header">{t.redSide}</div>
	</div>

	<div class="bans-container">
		<!-- Blue Bans -->
		<div class="ban-slots blue-bans">
			{#each blueBans as ban, i}
				<div
					class="ban-slot"
					class:active={activeSlot?.type === 'ban' &&
						activeSlot?.side === 'blue' &&
						activeSlot?.index === i}
					on:click={() => setActiveSlot('ban', 'blue', i)}
					on:contextmenu|preventDefault={() => removeFromSlot('ban', 'blue', i)}
					role="button"
					tabindex="0"
				>
					{#if ban}
						<img src={ban.image} alt={ban.name} class="banned-champion" />
						<div class="ban-overlay"></div>
					{:else}
						<div class="empty-ban"></div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Red Bans -->
		<div class="ban-slots red-bans">
			{#each redBans as ban, i}
				<div
					class="ban-slot"
					class:active={activeSlot?.type === 'ban' &&
						activeSlot?.side === 'red' &&
						activeSlot?.index === i}
					on:click={() => setActiveSlot('ban', 'red', i)}
					on:contextmenu|preventDefault={() => removeFromSlot('ban', 'red', i)}
					role="button"
					tabindex="0"
				>
					{#if ban}
						<img src={ban.image} alt={ban.name} class="banned-champion" />
						<div class="ban-overlay"></div>
					{:else}
						<div class="empty-ban"></div>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<!-- Main Draft Container -->
	<div class="draft-container">
		<!-- Blue Side Picks -->
		<div class="team-picks blue-picks">
			{#each bluePicks as pick, i}
				<div class="pick-row" class:gap-after={i === 2}>
					<div class="pick-label blue-label">{t.bluePrefix}{i + 1}</div>
					<div
						class="pick-slot"
						class:active={activeSlot?.type === 'pick' &&
							activeSlot?.side === 'blue' &&
							activeSlot?.index === i}
						on:click={() => setActiveSlot('pick', 'blue', i)}
						on:contextmenu|preventDefault={() => removeFromSlot('pick', 'blue', i)}
						role="button"
						tabindex="0"
					>
						{#if pick}
							<img src={pick.image} alt={pick.name} class="picked-champion" />
						{:else}
							<div class="empty-pick">
								</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>

		<!-- Center Column - Champion Pool -->
		<div class="center-column">
			<div class="search-and-filters">
				<div class="role-filters">
					{#each roles as role}
						<button
							class="role-btn"
							class:active={selectedRoles.includes(role.id)}
							on:click={() => selectRole(role.id, false)}
							on:contextmenu|preventDefault={() => selectRole(role.id, true)}
							title={role.name}
						>
							<img src={role.icon} alt={role.name} class="role-icon" />
						</button>
					{/each}
				</div>

				<div class="search-section">
					<input
						type="text"
						class="search-input"
						placeholder={t.searchChampions}
						bind:value={searchQuery}
					/>
				</div>
			</div>

			<div class="champion-grid">
				{#each filteredChampions as champion}
					<div
						class="champion-card"
						class:selected={selectedChampion?.id === champion.id}
						on:click={() => selectChampion(champion)}
						on:contextmenu|preventDefault={() => {
							if (selectedChampion?.id === champion.id) {
								selectedChampion = null;
							}
						}}
						role="button"
						tabindex="0"
					>
						<img src={champion.image} alt={champion.name} />
						<div class="champion-name">{champion.name}</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Red Side Picks -->
		<div class="team-picks red-picks">
			{#each redPicks as pick, i}
				<div class="pick-row" class:gap-after={i === 2}>
					<div
						class="pick-slot"
						class:active={activeSlot?.type === 'pick' &&
							activeSlot?.side === 'red' &&
							activeSlot?.index === i}
						on:click={() => setActiveSlot('pick', 'red', i)}
						on:contextmenu|preventDefault={() => removeFromSlot('pick', 'red', i)}
						role="button"
						tabindex="0"
					>
						{#if pick}
							<img src={pick.image} alt={pick.name} class="picked-champion" />
						{:else}
							<div class="empty-pick">
								</div>
						{/if}
					</div>
					<div class="pick-label red-label">{t.redPrefix}{i + 1}</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.drafting-page {
		height: 100vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		background-color: #0a0a0a;
	}

	/* Top Navbar */
	.top-navbar {
		position: absolute;
		top: 15px;
		right: 20px;
		display: flex;
		gap: 15px;
		z-index: 100;
	}

	.nav-btn {
		background: rgba(20, 20, 20, 0.95);
		border: 1px solid #2a2a2a;
		color: #fff;
		padding: 10px 20px;
		font-size: 15px;
		font-weight: 600;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.nav-btn:hover {
		background-color: #1a1a1a;
		border-color: #3a3a3a;
	}

	.ban-section {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0;
		padding: 20px 0 0 0;
		margin: 0 auto;
		max-width: 900px;
		width: 100%;
	}

	.team-header {
		flex: 1;
		padding: 10px 20px;
		text-align: center;
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 1.5px;
		color: #fff;
	}

	.blue-header {
		background-color: #4169E1;
	}

	.red-header {
		background-color: #E74856;
	}

	.bans-container {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0;
		padding: 0;
		margin: 0 auto 20px auto;
		max-width: 900px;
		width: 100%;
	}

	.ban-slots {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 5px;
		padding: 12px 20px;
		background-color: #0d0d0d;
	}

	.ban-slot {
		width: 81px;
		height: 81px;
		background-color: #050505;
		border: 2px solid #3a3a3a;
		border-radius: 4px;
		overflow: hidden;
		cursor: pointer;
		transition: all 0.2s;
		position: relative;
	}

	.ban-slot:hover {
		border-color: #4a4a4a;
		transform: scale(1.05);
	}

	.ban-slot.active {
		border-color: #FF1744;
		box-shadow: 0 0 12px rgba(255, 23, 68, 0.5);
	}

	.banned-champion {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.ban-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(255, 0, 0, 0.3));
		pointer-events: none;
	}

	.ban-overlay::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) rotate(-45deg);
		width: 70%;
		height: 2px;
		background-color: #ff0000;
	}

	.empty-ban {
		width: 100%;
		height: 100%;
		background-color: #0d0d0d;
	}

	.draft-container {
		display: flex;
		flex: 1;
		overflow: hidden;
		gap: 27px;
		padding: 22px 27px 27px 27px;
		justify-content: center;
		align-items: flex-start;
	}

	.team-picks {
		display: flex;
		flex-direction: column;
		gap: 11px;
		width: 176px;
	}

	.pick-row {
		display: flex;
		align-items: center;
		gap: 11px;
	}

	.pick-row.gap-after {
		margin-bottom: 32px;
	}

	.pick-label {
		font-size: 22px;
		font-weight: 700;
		width: 38px;
		text-align: center;
	}

	.blue-label {
		color: #5a8fff;
	}

	.red-label {
		color: #ff6b78;
	}

	.pick-slot {
		width: 122px;
		height: 122px;
		background-color: #0d0d0d;
		border: 2px solid #3a3a3a;
		border-radius: 6px;
		overflow: hidden;
		cursor: pointer;
		transition: all 0.2s;
		position: relative;
	}

	.pick-slot:hover {
		border-color: #4a4a4a;
		transform: scale(1.02);
	}

	.pick-slot.active {
		border-color: #FF1744;
		box-shadow: 0 0 15px rgba(255, 23, 68, 0.6);
	}

	.picked-champion {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.empty-pick {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #0d0d0d;
	}

	.empty-icon {
		font-size: 43px;
		opacity: 0.2;
	}

	.center-column {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 12px;
		overflow: hidden;
		max-width: 700px;
		min-height: 0;
	}

	.search-and-filters {
		display: flex;
		align-items: center;
		gap: 20px;
		justify-content: space-between;
	}

	.search-section {
		flex: 1;
		display: flex;
	}

	.search-input {
		width: 100%;
		padding: 10px 16px;
		background-color: #0d0d0d;
		border: 1px solid #2a2a2a;
		border-radius: 4px;
		color: #fff;
		font-size: 14px;
		transition: all 0.2s;
	}

	.search-input::placeholder {
		color: #666;
	}

	.search-input:focus {
		outline: none;
		border-color: #3a3a3a;
		background-color: #1a1a1a;
	}

	.role-filters {
		display: flex;
		gap: 8px;
		flex-wrap: nowrap;
	}

	.role-btn {
		background-color: #0d0d0d;
		border: 1px solid #2a2a2a;
		padding: 0;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		opacity: 0.5;
	}

	.role-btn:hover {
		border-color: #3a3a3a;
		background-color: #1a1a1a;
		opacity: 0.8;
	}

	.role-btn.active {
		border-color: #FF1744;
		background-color: rgba(255, 23, 68, 0.15);
		opacity: 1;
		box-shadow: 0 0 8px rgba(255, 23, 68, 0.3);
	}

	.role-icon {
		width: 24px;
		height: 24px;
		object-fit: contain;
	}

	.champion-grid {
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 6px;
		padding: 12px;
		background-color: #0d0d0d;
		border-radius: 6px;
		border: 1px solid #2a2a2a;
		max-height: calc(100vh - 280px);
		min-height: 0;
	}

	.champion-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		cursor: pointer;
		transition: all 0.2s;
		padding: 6px;
		border-radius: 6px;
	}

	.champion-card img {
		width: 100%;
		aspect-ratio: 1;
		border-radius: 6px;
		border: 2px solid #2a2a2a;
		transition: all 0.2s;
	}

	.champion-card:hover img {
		transform: scale(1.05);
	}

	.champion-card.selected img {
		border-color: #FF1744;
	}

	.champion-name {
		font-size: 12px;
		text-align: center;
		color: #ccc;
		line-height: 1.2;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: 600;
		letter-spacing: 0.2px;
	}

	.champion-card:hover .champion-name {
		color: #fff;
	}

	.champion-card.selected .champion-name {
		color: #FF1744;
		font-weight: 700;
	}

	.champion-grid::-webkit-scrollbar {
		width: 8px;
	}

	.champion-grid::-webkit-scrollbar-track {
		background: #1a1a1a;
		border-radius: 4px;
	}

	.champion-grid::-webkit-scrollbar-thumb {
		background: #3a3a3a;
		border-radius: 4px;
	}

	.champion-grid::-webkit-scrollbar-thumb:hover {
		background: #4a4a4a;
	}
</style>
