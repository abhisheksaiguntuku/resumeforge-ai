import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Briefcase, MapPin, Building, Edit, FileText, CheckCircle2, Zap } from 'lucide-react';

// Mock DB call. In a real app, this would use Prisma to fetch the job.
async function getJobDetails(id: string) {
  // Simulating a database fetch
  if (!id) return null;
  
  return {
    id,
    title: 'Senior Full Stack Developer',
    company: 'InnovateTech Solutions',
    location: 'Remote (US)',
    description: 'We are looking for an experienced Senior Full Stack Developer to lead our core product team...',
    requiredSkills: [
      { name: 'React', importance: 'High' },
      { name: 'TypeScript', importance: 'High' },
      { name: 'Node.js', importance: 'Medium' },
      { name: 'PostgreSQL', importance: 'Medium' },
      { name: 'AWS', importance: 'Low' },
    ],
    keywords: ['Scalability', 'Microservices', 'Mentorship', 'CI/CD', 'Next.js'],
    matchAnalysis: {
      score: 85,
      summary: "Strong match based on your recent work with Next.js and TypeScript. You exceed the required years of experience, but might want to highlight AWS experience more prominently.",
      strengths: ['React', 'TypeScript', 'Node.js'],
      gaps: ['AWS CI/CD pipelines'],
    }
  };
}

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const job = await getJobDetails(id);

  if (!job) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 text-gray-100">
      <div className="flex items-center justify-between mb-8">
        <Link href="/jobs" className="flex items-center text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Link>
        <Link 
          href={`/jobs/${job.id}/edit`} 
          className="flex items-center px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Details
        </Link>
      </div>

      {/* Header Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-4">{job.title}</h1>
        <div className="flex flex-wrap gap-6 text-gray-400">
          <div className="flex items-center">
            <Building className="w-5 h-5 mr-2 text-indigo-400" />
            {job.company}
          </div>
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-indigo-400" />
            {job.location}
          </div>
          <div className="flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-indigo-400" />
            Full-time
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-400" />
              Match Analysis
            </h2>
            <div className="p-4 bg-gray-800 rounded-xl mb-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-300 font-medium">Match Score</span>
                <span className="text-2xl font-bold text-green-400">{job.matchAnalysis.score}%</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{job.matchAnalysis.summary}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-400">Strengths</h3>
                {job.matchAnalysis.strengths.map(s => (
                  <div key={s} className="flex items-center text-sm text-green-400">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {s}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-400">Potential Gaps</h3>
                {job.matchAnalysis.gaps.map(g => (
                  <div key={g} className="flex items-center text-sm text-yellow-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mr-3" />
                    {g}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Job Description</h2>
            <div className="prose prose-invert max-w-none text-gray-400">
              <p>{job.description}</p>
            </div>
          </div>
        </div>

        {/* Right Column - Skills & Actions */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 border border-indigo-800 rounded-2xl p-6 shadow-xl text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Ready to apply?</h3>
            <p className="text-indigo-200 text-sm mb-6">
              Generate a tailored resume specifically optimized for this role.
            </p>
            <Link 
              href={`/resume/new?jobId=${job.id}`}
              className="block w-full py-3 px-4 bg-white text-indigo-900 font-semibold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
            >
              Generate Resume
            </Link>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Required Skills</h3>
            <div className="space-y-3">
              {job.requiredSkills.map((skill) => (
                <div key={skill.name} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <span className="text-gray-300 text-sm">{skill.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                    skill.importance === 'High' ? 'bg-red-500/20 text-red-400' :
                    skill.importance === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {skill.importance}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {job.keywords.map((keyword) => (
                <span 
                  key={keyword} 
                  className="px-3 py-1.5 bg-gray-800 text-gray-300 text-sm rounded-lg border border-gray-700"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
