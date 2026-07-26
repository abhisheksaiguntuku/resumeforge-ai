import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Register fonts
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2' },
  ],
})

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    fontSize: 11,
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 50,
    paddingRight: 50,
    color: '#1a1a1a',
    lineHeight: 1.4,
  },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  contactLine: { fontSize: 9, color: '#555', marginBottom: 16 },
  sectionHeading: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
    paddingBottom: 2,
    marginBottom: 6,
    marginTop: 12,
  },
  entryTitle: { fontSize: 11, fontWeight: 'bold' },
  entrySubtitle: { fontSize: 10, color: '#444', marginBottom: 2 },
  bullet: { fontSize: 10, marginLeft: 10, marginBottom: 2 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 4 },
  skillChip: { fontSize: 9, backgroundColor: '#f0f0f0', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3 },
})

interface ResumePDFProps {
  data: Record<string, unknown>
  templateId: string
  fontFamily: string
  fontSize: number
}

export function ResumePDF({ data }: ResumePDFProps) {
  const sections = (data.sections as Array<{
    type: string
    visible: boolean
    order: number
    content: Record<string, unknown>
  }> | undefined) ?? []

  const sorted = [...sections].sort((a, b) => a.order - b.order).filter(s => s.visible)

  const personalSection = sorted.find(s => s.type === 'personal')
  const personal = personalSection?.content as Record<string, string> | undefined

  const contactParts = [
    personal?.email,
    personal?.phone,
    personal?.location,
    personal?.linkedin,
    personal?.github,
  ].filter(Boolean).join(' | ')

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        {personal && (
          <View>
            <Text style={styles.name}>{personal.fullName ?? ''}</Text>
            <Text style={styles.contactLine}>{contactParts}</Text>
          </View>
        )}

        {sorted.map((section, idx) => {
          if (section.type === 'personal') return null
          const content = section.content as Record<string, unknown>

          if (section.type === 'summary') {
            return (
              <View key={`summary-${idx}`}>
                <Text style={styles.sectionHeading}>Summary</Text>
                <Text style={styles.bullet}>{content.text as string}</Text>
              </View>
            )
          }

          if (section.type === 'skills') {
            const cats = content as Record<string, string[]>
            return (
              <View key={`skills-${idx}`}>
                <Text style={styles.sectionHeading}>Skills</Text>
                {Object.entries(cats).map(([cat, skills]) =>
                  skills?.length ? (
                    <View key={cat} style={{ marginBottom: 3 }}>
                      <Text style={[styles.entrySubtitle, { fontWeight: 'bold' }]}>{cat}: </Text>
                      <Text style={styles.bullet}>{skills.join(', ')}</Text>
                    </View>
                  ) : null
                )}
              </View>
            )
          }

          if (section.type === 'education') {
            const items = content.items as Array<Record<string, unknown>> ?? []
            return (
              <View key={`education-${idx}`}>
                <Text style={styles.sectionHeading}>Education</Text>
                {items.map((item, i) => (
                  <View key={i} style={{ marginBottom: 6 }}>
                    <Text style={styles.entryTitle}>{item.institution as string}</Text>
                    <Text style={styles.entrySubtitle}>
                      {[item.degree, item.fieldOfStudy].filter(Boolean).join(', ')} | {item.startDate as string} – {item.endDate as string ?? 'Present'}
                      {item.cgpa ? ` | CGPA: ${item.cgpa}` : ''}
                    </Text>
                  </View>
                ))}
              </View>
            )
          }

          if (section.type === 'experience') {
            const items = content.items as Array<Record<string, unknown>> ?? []
            return (
              <View key={`experience-${idx}`}>
                <Text style={styles.sectionHeading}>Experience</Text>
                {items.map((item, i) => (
                  <View key={i} style={{ marginBottom: 8 }}>
                    <Text style={styles.entryTitle}>{item.jobTitle as string} — {item.company as string}</Text>
                    <Text style={styles.entrySubtitle}>
                      {item.startDate as string} – {item.endDate as string ?? 'Present'}{item.location ? ` | ${item.location}` : ''}
                    </Text>
                    {((item.bullets as string[]) ?? []).map((b, j) => (
                      <Text key={j} style={styles.bullet}>• {b}</Text>
                    ))}
                  </View>
                ))}
              </View>
            )
          }

          if (section.type === 'projects') {
            const items = content.items as Array<Record<string, unknown>> ?? []
            return (
              <View key={`projects-${idx}`}>
                <Text style={styles.sectionHeading}>Projects</Text>
                {items.map((item, i) => (
                  <View key={i} style={{ marginBottom: 8 }}>
                    <Text style={styles.entryTitle}>{item.name as string}</Text>
                    <Text style={styles.entrySubtitle}>{(item.technologies as string[])?.join(', ')}</Text>
                    {((item.bullets as string[]) ?? []).map((b, j) => (
                      <Text key={j} style={styles.bullet}>• {b}</Text>
                    ))}
                  </View>
                ))}
              </View>
            )
          }

          if (section.type === 'certifications') {
            const items = content.items as Array<Record<string, unknown>> ?? []
            return (
              <View key={`certifications-${idx}`}>
                <Text style={styles.sectionHeading}>Certifications</Text>
                {items.map((item, i) => (
                  <View key={i} style={{ marginBottom: 3 }}>
                    <Text style={styles.bullet}>• {item.name as string}{item.issuer ? ` — ${item.issuer}` : ''}{item.issueDate ? ` (${item.issueDate})` : ''}</Text>
                  </View>
                ))}
              </View>
            )
          }

          return null
        })}
      </Page>
    </Document>
  )
}
