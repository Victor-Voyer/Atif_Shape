"use strict";

const CELLS = [
  {
    category: "Musculation",
    focus: "Haut du corps",
    equipment: "none",
    exercises: [
      { name: "Pompes", sets: 4, reps: "12", instructions: "Mains à largeur d'épaules, corps gainé, descendre puis pousser." },
      { name: "Dips sur chaise", sets: 3, reps: "10", instructions: "Mains sur le bord d'une chaise, fléchir les coudes à 90° puis repousser." },
      { name: "Tirage élastique", sets: 3, reps: "15", instructions: "Élastique fixé en hauteur, tirer vers la poitrine en serrant les omoplates." },
      { name: "Pompes pieds surélevés", sets: 3, reps: "10", instructions: "Pieds sur une chaise, mains au sol, cible le haut des pectoraux et les épaules." },
    ],
  },
  {
    category: "Musculation",
    focus: "Haut du corps",
    equipment: "home",
    exercises: [
      { name: "Développé haltères", sets: 4, reps: "10", instructions: "Allongé ou assis, pousser les haltères au-dessus des épaules." },
      { name: "Rowing haltère", sets: 4, reps: "12", instructions: "Buste penché, tirer l'haltère vers la hanche en serrant l'omoplate." },
      { name: "Élévations latérales", sets: 3, reps: "15", instructions: "Bras légèrement fléchis, lever les haltères jusqu'à hauteur d'épaules." },
      { name: "Curl biceps haltères", sets: 3, reps: "12", instructions: "Coudes fixes le long du corps, fléchir jusqu'aux épaules." },
    ],
  },
  {
    category: "Musculation",
    focus: "Haut du corps",
    equipment: "gym",
    exercises: [
      { name: "Développé couché", sets: 4, reps: "8", instructions: "Barre ou haltères, descendre à la poitrine puis pousser." },
      { name: "Tirage poulie haute", sets: 4, reps: "10", instructions: "Tirer la barre vers le haut de la poitrine, dos droit." },
      { name: "Élévations latérales machine", sets: 3, reps: "12", instructions: "Réglage à hauteur d'épaules, mouvement contrôlé sans à-coup." },
      { name: "Curl au pupitre", sets: 3, reps: "12", instructions: "Coudes calés, fléchir sans balancer le buste." },
    ],
  },
  {
    category: "Musculation",
    focus: "Bas du corps",
    equipment: "none",
    exercises: [
      { name: "Squats", sets: 4, reps: "15", instructions: "Pieds largeur d'épaules, descendre hanches en arrière, dos droit." },
      { name: "Fentes avant", sets: 3, reps: "12 par jambe", instructions: "Grand pas en avant, descendre le genou arrière près du sol." },
      { name: "Pont fessier", sets: 3, reps: "15", instructions: "Allongé, pousser les hanches vers le haut en contractant les fessiers." },
      { name: "Mollets debout", sets: 3, reps: "20", instructions: "Monter sur la pointe des pieds, redescendre lentement." },
    ],
  },
  {
    category: "Musculation",
    focus: "Bas du corps",
    equipment: "home",
    exercises: [
      { name: "Squats haltères", sets: 4, reps: "12", instructions: "Haltères le long du corps, squat classique avec charge additionnelle." },
      { name: "Fentes lestées", sets: 3, reps: "10 par jambe", instructions: "Un haltère dans chaque main, fente avant contrôlée." },
      { name: "Soulevé de terre roumain haltères", sets: 3, reps: "12", instructions: "Jambes semi-tendues, descendre les haltères le long des cuisses." },
      { name: "Mollets haltères", sets: 3, reps: "20", instructions: "Haltères en mains, montée sur pointe des pieds." },
    ],
  },
  {
    category: "Musculation",
    focus: "Bas du corps",
    equipment: "gym",
    exercises: [
      { name: "Presse à cuisses", sets: 4, reps: "12", instructions: "Pousser la plateforme sans verrouiller complètement les genoux." },
      { name: "Leg curl", sets: 3, reps: "12", instructions: "Allongé, fléchir les jambes en contractant les ischios." },
      { name: "Squat guidé", sets: 3, reps: "10", instructions: "Trajectoire guidée par la machine, descente contrôlée." },
      { name: "Mollets à la machine", sets: 3, reps: "20", instructions: "Montée complète sur pointe des pieds, contraction en haut." },
    ],
  },
  {
    category: "Musculation",
    focus: "Full body",
    equipment: "none",
    exercises: [
      { name: "Pompes", sets: 3, reps: "12", instructions: "Mains à largeur d'épaules, corps gainé, descendre puis pousser." },
      { name: "Squats", sets: 3, reps: "15", instructions: "Pieds largeur d'épaules, descendre hanches en arrière, dos droit." },
      { name: "Burpees", sets: 3, reps: "10", instructions: "Squat, planche, pompe, saut vertical : enchaînement complet." },
      { name: "Gainage", sets: 3, reps: "30 sec", instructions: "Corps aligné en planche, abdos et fessiers contractés." },
    ],
  },
  {
    category: "Musculation",
    focus: "Full body",
    equipment: "home",
    exercises: [
      { name: "Développé haltères", sets: 3, reps: "10", instructions: "Allongé ou assis, pousser les haltères au-dessus des épaules." },
      { name: "Squats haltères", sets: 3, reps: "12", instructions: "Haltères le long du corps, squat classique avec charge additionnelle." },
      { name: "Rowing haltère", sets: 3, reps: "12", instructions: "Buste penché, tirer l'haltère vers la hanche en serrant l'omoplate." },
      { name: "Gainage", sets: 3, reps: "30 sec", instructions: "Corps aligné en planche, abdos et fessiers contractés." },
    ],
  },
  {
    category: "Musculation",
    focus: "Full body",
    equipment: "gym",
    exercises: [
      { name: "Développé couché", sets: 3, reps: "10", instructions: "Barre ou haltères, descendre à la poitrine puis pousser." },
      { name: "Presse à cuisses", sets: 3, reps: "12", instructions: "Pousser la plateforme sans verrouiller complètement les genoux." },
      { name: "Tirage poulie haute", sets: 3, reps: "10", instructions: "Tirer la barre vers le haut de la poitrine, dos droit." },
      { name: "Gainage", sets: 3, reps: "30 sec", instructions: "Corps aligné en planche, abdos et fessiers contractés." },
    ],
  },
  {
    category: "Renforcement",
    focus: "Full body léger",
    equipment: "none",
    exercises: [
      { name: "Squats au poids du corps", sets: 3, reps: "12", instructions: "Amplitude confortable, sans à-coup sur les genoux." },
      { name: "Pompes sur genoux", sets: 3, reps: "10", instructions: "Genoux au sol, corps aligné du bassin aux épaules." },
      { name: "Gainage", sets: 3, reps: "20 sec", instructions: "Corps aligné en planche, abdos et fessiers contractés." },
      { name: "Pont fessier", sets: 3, reps: "15", instructions: "Allongé, pousser les hanches vers le haut en contractant les fessiers." },
    ],
  },
  {
    category: "Renforcement",
    focus: "Full body léger",
    equipment: "home",
    exercises: [
      { name: "Squats avec élastique", sets: 3, reps: "15", instructions: "Élastique au-dessus des genoux, squat en gardant la tension." },
      { name: "Rowing élastique", sets: 3, reps: "15", instructions: "Élastique fixé devant, tirer vers la taille sans à-coup." },
      { name: "Gainage", sets: 3, reps: "20 sec", instructions: "Corps aligné en planche, abdos et fessiers contractés." },
      { name: "Élévations latérales élastique", sets: 3, reps: "15", instructions: "Pied sur l'élastique, lever les bras jusqu'à hauteur d'épaules." },
    ],
  },
  {
    category: "Renforcement",
    focus: "Full body léger",
    equipment: "gym",
    exercises: [
      { name: "Presse à cuisses, charge légère", sets: 3, reps: "15", instructions: "Charge réduite, mouvement lent et contrôlé." },
      { name: "Tirage poulie, charge légère", sets: 3, reps: "15", instructions: "Charge réduite, se concentrer sur la contraction du dos." },
      { name: "Gainage", sets: 3, reps: "20 sec", instructions: "Corps aligné en planche, abdos et fessiers contractés." },
      { name: "Extension mollets machine", sets: 3, reps: "15", instructions: "Montée sur pointe des pieds, charge légère." },
    ],
  },
  {
    category: "Renforcement",
    focus: "Full body",
    equipment: "none",
    exercises: [
      { name: "Pompes", sets: 4, reps: "12", instructions: "Mains à largeur d'épaules, corps gainé, descendre puis pousser." },
      { name: "Squats", sets: 4, reps: "15", instructions: "Pieds largeur d'épaules, descendre hanches en arrière, dos droit." },
      { name: "Gainage", sets: 3, reps: "30 sec", instructions: "Corps aligné en planche, abdos et fessiers contractés." },
      { name: "Fentes avant", sets: 3, reps: "12 par jambe", instructions: "Grand pas en avant, descendre le genou arrière près du sol." },
    ],
  },
  {
    category: "Renforcement",
    focus: "Full body",
    equipment: "home",
    exercises: [
      { name: "Développé haltères", sets: 4, reps: "10", instructions: "Allongé ou assis, pousser les haltères au-dessus des épaules." },
      { name: "Squats haltères", sets: 4, reps: "12", instructions: "Haltères le long du corps, squat classique avec charge additionnelle." },
      { name: "Gainage", sets: 3, reps: "30 sec", instructions: "Corps aligné en planche, abdos et fessiers contractés." },
      { name: "Rowing haltère", sets: 3, reps: "12", instructions: "Buste penché, tirer l'haltère vers la hanche en serrant l'omoplate." },
    ],
  },
  {
    category: "Renforcement",
    focus: "Full body",
    equipment: "gym",
    exercises: [
      { name: "Presse à cuisses", sets: 4, reps: "12", instructions: "Pousser la plateforme sans verrouiller complètement les genoux." },
      { name: "Tirage poulie haute", sets: 4, reps: "12", instructions: "Tirer la barre vers le haut de la poitrine, dos droit." },
      { name: "Développé couché", sets: 3, reps: "10", instructions: "Barre ou haltères, descendre à la poitrine puis pousser." },
      { name: "Gainage", sets: 3, reps: "30 sec", instructions: "Corps aligné en planche, abdos et fessiers contractés." },
    ],
  },
  {
    category: "Cardio",
    focus: "Récupération active",
    equipment: "none",
    exercises: [
      { name: "Marche rapide", sets: 1, reps: null, instructions: "Allure soutenue mais confortable, respiration régulière." },
      { name: "Jogging très léger", sets: 1, reps: null, instructions: "Allure de récupération, sans essoufflement." },
      { name: "Montée d'escaliers, rythme doux", sets: 1, reps: null, instructions: "Rythme régulier, sans forcer sur les genoux." },
      { name: "Corde à sauter, rythme lent", sets: 1, reps: null, instructions: "Sauts bas et réguliers, respiration calme." },
    ],
  },
  {
    category: "Cardio",
    focus: "Récupération active",
    equipment: "home",
    exercises: [
      { name: "Vélo d'appartement, faible intensité", sets: 1, reps: null, instructions: "Résistance légère, cadence confortable." },
      { name: "Rameur d'appartement, rythme doux", sets: 1, reps: null, instructions: "Mouvement fluide, effort léger constant." },
      { name: "Corde à sauter, rythme lent", sets: 1, reps: null, instructions: "Sauts bas et réguliers, respiration calme." },
      { name: "Montée de step, rythme doux", sets: 1, reps: null, instructions: "Cadence régulière, alterner la jambe d'appel." },
    ],
  },
  {
    category: "Cardio",
    focus: "Récupération active",
    equipment: "gym",
    exercises: [
      { name: "Vélo, allure légère", sets: 1, reps: null, instructions: "Résistance légère, cadence confortable." },
      { name: "Tapis de course, marche", sets: 1, reps: null, instructions: "Vitesse de marche soutenue, pas de course." },
      { name: "Rameur, rythme doux", sets: 1, reps: null, instructions: "Mouvement fluide, effort léger constant." },
      { name: "Elliptique, faible intensité", sets: 1, reps: null, instructions: "Résistance légère, mouvement fluide." },
    ],
  },
  {
    category: "Cardio",
    focus: "Faible impact",
    equipment: "none",
    exercises: [
      { name: "Marche rapide", sets: 1, reps: null, instructions: "Allure soutenue mais confortable, respiration régulière." },
      { name: "Marche en côte", sets: 1, reps: null, instructions: "Terrain légèrement pentu, allure régulière." },
      { name: "Montée d'escaliers", sets: 1, reps: null, instructions: "Rythme soutenu, sans à-coup sur les genoux." },
      { name: "Corde à sauter, rythme modéré", sets: 1, reps: null, instructions: "Sauts réguliers, sans impact excessif." },
    ],
  },
  {
    category: "Cardio",
    focus: "Faible impact",
    equipment: "home",
    exercises: [
      { name: "Vélo d'appartement", sets: 1, reps: null, instructions: "Résistance modérée, cadence régulière." },
      { name: "Rameur d'appartement", sets: 1, reps: null, instructions: "Mouvement fluide, effort modéré constant." },
      { name: "Corde à sauter", sets: 1, reps: null, instructions: "Sauts réguliers, sans impact excessif." },
      { name: "Step, rythme modéré", sets: 1, reps: null, instructions: "Cadence soutenue, alterner la jambe d'appel." },
    ],
  },
  {
    category: "Cardio",
    focus: "Faible impact",
    equipment: "gym",
    exercises: [
      { name: "Vélo, allure modérée", sets: 1, reps: null, instructions: "Résistance modérée, cadence régulière." },
      { name: "Elliptique", sets: 1, reps: null, instructions: "Mouvement fluide, sans impact articulaire." },
      { name: "Natation", sets: 1, reps: null, instructions: "Nage tranquille, sans forcer sur les articulations." },
      { name: "Rameur", sets: 1, reps: null, instructions: "Mouvement fluide, effort modéré constant." },
    ],
  },
  {
    category: "Cardio",
    focus: "HIIT",
    equipment: "none",
    exercises: [
      { name: "Sprint sur place / marche", sets: 8, reps: "30 sec effort / 90 sec récup", instructions: "Alterner effort maximal et marche de récupération." },
      { name: "Burpees", sets: 6, reps: "30 sec effort / 60 sec récup", instructions: "Enchaînement complet à rythme soutenu." },
      { name: "Mountain climbers", sets: 8, reps: "30 sec effort / 60 sec récup", instructions: "Position de planche, genoux alternés rapidement vers la poitrine." },
      { name: "Jumping jacks", sets: 8, reps: "30 sec effort / 30 sec récup", instructions: "Sauts jambes/bras écartés puis resserrés, rythme soutenu." },
    ],
  },
  {
    category: "Cardio",
    focus: "HIIT",
    equipment: "home",
    exercises: [
      { name: "Corde à sauter", sets: 8, reps: "30 sec effort / 90 sec récup", instructions: "Rythme rapide sur l'effort, marche sur la récupération." },
      { name: "Squats sautés", sets: 6, reps: "12", instructions: "Squat suivi d'un saut vertical explosif." },
      { name: "Fentes sautées", sets: 6, reps: "12", instructions: "Alterner les jambes en sautant à chaque répétition." },
      { name: "Rameur d'appartement fractionné", sets: 6, reps: "30 sec effort / 60 sec récup", instructions: "Effort maximal puis récupération active lente." },
    ],
  },
  {
    category: "Cardio",
    focus: "HIIT",
    equipment: "gym",
    exercises: [
      { name: "Vélo fractionné", sets: 8, reps: "30 sec effort / 90 sec récup", instructions: "Résistance élevée sur l'effort, légère sur la récupération." },
      { name: "Rameur fractionné", sets: 8, reps: "30 sec effort / 90 sec récup", instructions: "Effort maximal puis récupération active lente." },
      { name: "Tapis fractionné (sprint)", sets: 6, reps: "30 sec effort / 90 sec récup", instructions: "Sprint puis marche de récupération." },
      { name: "Assault bike", sets: 6, reps: "20 sec effort / 40 sec récup", instructions: "Effort maximal bras et jambes, récupération lente." },
    ],
  },
  {
    category: "Cardio",
    focus: "Continu",
    equipment: "none",
    exercises: [
      { name: "Course à allure modérée", sets: 1, reps: null, instructions: "Allure régulière, respiration contrôlée sur toute la durée." },
      { name: "Marche rapide prolongée", sets: 1, reps: null, instructions: "Allure soutenue maintenue sur toute la durée." },
      { name: "Montée d'escaliers en continu", sets: 1, reps: null, instructions: "Rythme régulier maintenu sans pause longue." },
      { name: "Vélo en extérieur, allure régulière", sets: 1, reps: null, instructions: "Cadence stable, terrain plat de préférence." },
    ],
  },
  {
    category: "Cardio",
    focus: "Continu",
    equipment: "home",
    exercises: [
      { name: "Vélo d'appartement, allure régulière", sets: 1, reps: null, instructions: "Résistance modérée, cadence stable sur toute la durée." },
      { name: "Rameur d'appartement, allure régulière", sets: 1, reps: null, instructions: "Mouvement fluide et régulier, effort constant." },
      { name: "Elliptique d'appartement", sets: 1, reps: null, instructions: "Cadence stable, effort modéré constant." },
      { name: "Step, allure régulière", sets: 1, reps: null, instructions: "Cadence stable, alterner la jambe d'appel régulièrement." },
    ],
  },
  {
    category: "Cardio",
    focus: "Continu",
    equipment: "gym",
    exercises: [
      { name: "Course sur tapis", sets: 1, reps: null, instructions: "Allure régulière, respiration contrôlée sur toute la durée." },
      { name: "Vélo, allure régulière", sets: 1, reps: null, instructions: "Résistance modérée, cadence stable sur toute la durée." },
      { name: "Rameur, allure régulière", sets: 1, reps: null, instructions: "Mouvement fluide et régulier, effort constant." },
      { name: "Natation, allure régulière", sets: 1, reps: null, instructions: "Nage régulière, respiration maîtrisée." },
    ],
  },
  {
    category: "Mobilité",
    focus: "Étirements & souplesse",
    equipment: "none",
    exercises: [
      { name: "Étirements ischios-jambiers", sets: 3, reps: "30 sec", instructions: "Jambe tendue, buste penché en avant sans forcer." },
      { name: "Étirements dos et hanches", sets: 3, reps: "30 sec", instructions: "Genou vers la poitrine, dos au sol." },
      { name: "Étirements épaules et bras", sets: 3, reps: "30 sec", instructions: "Bras croisé devant la poitrine, tenir sans à-coup." },
      { name: "Posture du chat-vache", sets: 3, reps: "30 sec", instructions: "À quatre pattes, alterner dos rond et dos creux." },
    ],
  },
  {
    category: "Mobilité",
    focus: "Étirements & souplesse",
    equipment: "home",
    exercises: [
      { name: "Étirements ischios-jambiers, au tapis", sets: 3, reps: "30 sec", instructions: "Jambe tendue, buste penché en avant sans forcer." },
      { name: "Étirements dos et hanches, au tapis", sets: 3, reps: "30 sec", instructions: "Genou vers la poitrine, dos au sol." },
      { name: "Salutation au soleil", sets: 3, reps: "30 sec", instructions: "Enchaînement de yoga doux, respiration guidée." },
      { name: "Étirements épaules et bras, au tapis", sets: 3, reps: "30 sec", instructions: "Bras croisé devant la poitrine, tenir sans à-coup." },
    ],
  },
  {
    category: "Mobilité",
    focus: "Étirements & souplesse",
    equipment: "gym",
    exercises: [
      { name: "Cours collectif stretching", sets: 1, reps: null, instructions: "Séance encadrée, suivre le rythme du cours." },
      { name: "Cours collectif yoga", sets: 1, reps: null, instructions: "Séance encadrée, respiration et postures guidées." },
      { name: "Étirements guidés au sol", sets: 3, reps: "30 sec", instructions: "Sur tapis de salle, tenir chaque position sans forcer." },
      { name: "Mobilité articulaire sur banc", sets: 3, reps: "30 sec", instructions: "Mouvements amples et lents, sans charge." },
    ],
  },
  {
    category: "Mobilité",
    focus: "Récupération",
    equipment: "none",
    exercises: [
      { name: "Étirements doux au sol", sets: 3, reps: "30 sec", instructions: "Positions relâchées, sans forcer sur les articulations." },
      { name: "Respiration et relâchement musculaire", sets: 1, reps: null, instructions: "Respiration lente, allongé, relâcher chaque groupe musculaire." },
      { name: "Marche de récupération très légère", sets: 1, reps: null, instructions: "Allure très douce, favorise la circulation." },
      { name: "Auto-massage aux mains", sets: 1, reps: null, instructions: "Pression douce sur les muscles sollicités." },
    ],
  },
  {
    category: "Mobilité",
    focus: "Récupération",
    equipment: "home",
    exercises: [
      { name: "Étirements doux, au tapis", sets: 3, reps: "30 sec", instructions: "Positions relâchées, sans forcer sur les articulations." },
      { name: "Auto-massage au rouleau de mousse", sets: 1, reps: null, instructions: "Rouler lentement sur les groupes musculaires sollicités." },
      { name: "Respiration et relâchement, au tapis", sets: 1, reps: null, instructions: "Respiration lente, allongé, relâcher chaque groupe musculaire." },
      { name: "Yoga doux de récupération", sets: 1, reps: null, instructions: "Postures douces, respiration calme." },
    ],
  },
  {
    category: "Mobilité",
    focus: "Récupération",
    equipment: "gym",
    exercises: [
      { name: "Étirements doux + sauna", sets: 1, reps: null, instructions: "Étirements légers puis détente en sauna si disponible." },
      { name: "Étirements doux + piscine détente", sets: 1, reps: null, instructions: "Étirements légers puis quelques longueurs tranquilles." },
      { name: "Auto-massage au rouleau de mousse", sets: 1, reps: null, instructions: "Rouler lentement sur les groupes musculaires sollicités." },
      { name: "Séance légère au vélo, récupération", sets: 1, reps: null, instructions: "Résistance très légère, cadence lente." },
    ],
  },
];

module.exports = {
  async up(queryInterface) {
    const rows = CELLS.flatMap((cell) =>
      cell.exercises.map((exercise) => ({
        name: exercise.name,
        category: cell.category,
        focus: cell.focus,
        equipment: cell.equipment,
        default_sets: exercise.sets,
        default_reps: exercise.reps,
        instructions: exercise.instructions,
      }))
    );

    await queryInterface.bulkInsert("exercises", rows);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete("exercises", null, {});
  },
};
