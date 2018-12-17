enum SectionNames {
  CLASS = 'Class Rating',
  LEARNABILITY = 'Learnability',
  INSTRUCTOR = 'Instructor Performance',
  EFFECTIVENESS = 'Effectiveness',
}

function getLink(sectionName: SectionNames) {
  return sectionName.toLowerCase().replace(' ', '-');
}

export default SectionNames;
export { getLink };
