import { notFound } from "next/navigation";
import { Portfolio } from "@/types";
import { Github, ExternalLink } from "lucide-react";
import Link from "next/link";

// Fetch the portfolio data from the backend — supports both UUID and slug
async function getPortfolio(idOrSlug: string): Promise<Portfolio | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
  try {
    // Try slug endpoint first
    const slugRes = await fetch(`${apiUrl}/portfolios/slug/${idOrSlug}`, { cache: 'no-store' });
    if (slugRes.ok) return slugRes.json();

    // Fallback to ID lookup
    const idRes = await fetch(`${apiUrl}/portfolios/${idOrSlug}`, { cache: 'no-store' });
    if (idRes.ok) return idRes.json();

    return null;
  } catch {
    return null;
  }
}

// Theme configuration mapping
const themeStyles = {
  minimal: {
    bg: "bg-stone-50 text-stone-900",
    cardBg: "bg-white border-stone-200 shadow-sm",
    accent: "text-stone-900",
    badgeBg: "bg-stone-100 text-stone-700 hover:bg-stone-200",
    font: "font-serif",
  },
  midnight: {
    bg: "bg-slate-950 text-slate-100",
    cardBg: "bg-slate-900 border-slate-800 shadow-md",
    accent: "text-indigo-400",
    badgeBg: "bg-indigo-950 text-indigo-300 border-indigo-900 hover:bg-indigo-900",
    font: "font-sans",
  },
  vibrant: {
    bg: "bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 text-white min-h-screen",
    cardBg: "bg-white/10 backdrop-blur-lg border-white/20 shadow-xl text-white",
    accent: "text-pink-300",
    badgeBg: "bg-white/20 text-white hover:bg-white/30",
    font: "font-mono font-medium",
  },
};

export default async function PortfolioViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const portfolio = await getPortfolio(id);

  if (!portfolio) {
    notFound();
  }

  // Fallback to "minimal" if an unknown theme is configured
  const theme = themeStyles[portfolio.theme as keyof typeof themeStyles] || themeStyles.minimal;

  // Derive the Avatar from what we saved in the builder
  const userName = portfolio.data?.name || portfolio.user?.name || "Developer";
  const avatarUrl = portfolio.data?.avatarSource === "upload" && portfolio.avatarUrl
    ? portfolio.avatarUrl
    : portfolio.data?.avatarSource === "github" && portfolio.user?.githubUsername
      ? `https://avatars.githubusercontent.com/${portfolio.user.githubUsername}`
      : "/default-avatar.png";

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.font} transition-colors duration-300`}>
      <main className="max-w-5xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left mb-20">
          <div className="shrink-0 relative">
            <img 
              src={avatarUrl} 
              alt={userName} 
              className={`w-40 h-40 rounded-full object-cover shadow-2xl ${
                portfolio.theme === 'vibrant' ? 'ring-4 ring-white/30' : 
                portfolio.theme === 'midnight' ? 'ring-4 ring-indigo-500/30' : 'ring-4 ring-stone-200'
              }`}
            />
            {portfolio.published && (
              <div className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-white" title="Available for hire">
                <span className="h-2.5 w-2.5 rounded-full bg-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-4 pt-2">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              {userName}
            </h1>
            <h2 className={`text-2xl md:text-3xl font-medium ${theme.accent}`}>
              {portfolio.title}
            </h2>
            {portfolio.bio && (
              <p className={`text-lg md:text-xl max-w-2xl leading-relaxed opacity-80 ${portfolio.theme === 'minimal' ? 'text-stone-600' : ''}`}>
                {portfolio.bio}
              </p>
            )}
            
            {/* Social Links (Mockup for now, we can add inputs for these later!) */}
            <div className="flex gap-4 justify-center md:justify-start pt-4">
              {portfolio.user?.githubUsername && (
                <Link href={`https://github.com/${portfolio.user.githubUsername}`} target="_blank" className={`p-2 rounded-full transition-transform hover:scale-110 ${theme.badgeBg}`}>
                  <Github className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Projects Section */}
        {portfolio.projects && portfolio.projects.length > 0 && (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold tracking-tight mb-8 flex items-center gap-3">
              <span className={`h-8 w-1.5 rounded-full ${portfolio.theme === 'midnight' ? 'bg-indigo-500' : portfolio.theme === 'vibrant' ? 'bg-white' : 'bg-stone-800'}`} />
              Featured Projects
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolio.projects.map((project) => (
                <div 
                  key={project.id} 
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 transition-all hover:-translate-y-1 hover:shadow-xl ${theme.cardBg}`}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="text-xl font-bold">{project.title}</h4>
                      <div className="flex gap-2">
                        {project.githubUrl && (
                          <Link href={project.githubUrl} target="_blank" className="opacity-60 hover:opacity-100 transition-opacity">
                            <Github className="w-5 h-5" />
                          </Link>
                        )}
                        {project.liveUrl && (
                          <Link href={project.liveUrl} target="_blank" className={`opacity-60 hover:opacity-100 transition-opacity ${theme.accent}`}>
                            <ExternalLink className="w-5 h-5" />
                          </Link>
                        )}
                      </div>
                    </div>
                    
                    <p className="line-clamp-3 opacity-80 leading-relaxed text-sm">
                      {project.description || "No description provided."}
                    </p>
                    
                    {/* GitHub Stats */}
                    {(project.stars! > 0 || project.forks! > 0) && (
                      <div className="flex gap-3 text-sm opacity-70">
                        {project.stars! > 0 && <span>⭐ {project.stars}</span>}
                        {project.forks! > 0 && <span>🔀 {project.forks}</span>}
                      </div>
                    )}
                  </div>
                  
                  {/* Tech Stack */}
                  {project.techStack && project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6">
                      {project.techStack.map((tech) => (
                        <span key={tech} className={`px-2.5 py-1 text-xs rounded-full border ${theme.badgeBg}`}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
