import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import JobFormStep1 from '@/components/JobFormStep1';
import logo from './logo.png';
import Footer from '@/components/Footer';
import pic from './pic.png';

function App() {
  const [formData, setFormData] = useState({
    jobTitle: '',
    yearsOfExperience: '',
    jobType: '',
    requiredSkills: '',
  });

  const [jobDescription, setJobDescription] = useState('');
  const { toast } = useToast();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNewSubmit = async (data) => {
    if (!data.jobTitle || !data.jobType) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields before submitting.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const jobPayload = {
        org_id: 1,
        exe_name: 'run 1',
        workflow_id: 'jd_maker',
        instraction: `Looking for ${data.requiredSkills} developer with ${data.yearsOfExperience} years of experience for a ${data.jobType} role.`,
      };

      console.log('📤 Final Payload:', jobPayload);

      const formData = new FormData();
      formData.append('data', JSON.stringify(jobPayload));

      const response = await fetch(
        'https://agentic-ai.co.in/api/agentic-ai/workflow-exe',
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || `Upload failed with status ${response.status}`);
      }

      const jobDesc = result?.data?.result?.[0];

      setJobDescription(jobDesc); // ⬅️ Display on same page

      toast({
        title: 'Success!',
        description: 'Job description created successfully.',
      });

      return jobDesc;
    } catch (error) {
      console.error('❌ Upload failed:', error);
      toast({
        title: 'Upload Failed',
        description: error.message || '❌ Something went wrong.',
        variant: 'destructive',
      });
    }
  };

  // Auto-populate jobDescription and requiredSkills from URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
  
    const decodeSafe = (str) => {
      try {
        return decodeURIComponent(str);
      } catch {
        return '';
      }
    };
  
    const jobTypeLabel = decodeSafe(params.get('jobtype') || '').trim();
  
    // Map labels from URL param to select values exactly
    const jobTypeMap = {
      'Full time': 'fulltime',
      'Part time': 'parttime',
      'Contract': 'contract',
      'Freelance': 'freelance',
      'Internship': 'internship',
    };
  
    const mappedJobType = jobTypeMap[jobTypeLabel] || '';
  
    setFormData(prev => ({
      ...prev,
      requiredSkills: decodeSafe(params.get('skills') || ''),
      yearsOfExperience: decodeSafe(params.get('yoe') || ''),
      jobTitle: decodeSafe(params.get('jobtitle') || ''),
      jobType: mappedJobType,  // THIS MUST BE a valid option value or empty string
    }));
  }, []);

  // Helper to strip HTML tags from job description
  const stripHtml = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    // Add space after block elements to keep words separate
    const blockTags = ['p', 'div', 'br', 'li'];
    blockTags.forEach(tag => {
      const elements = div.getElementsByTagName(tag);
      for (let el of elements) {
        el.appendChild(document.createTextNode(' '));
      }
    });
    return div.textContent || div.innerText || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 relative overflow-hidden">
      <Helmet>
        <title>Talent Sift - Job Description Platform</title>
        <meta
          name="description"
          content="Create and post job opportunities with Talent Sift's intuitive job posting platform"
        />
      </Helmet>

      <motion.div
        className="absolute inset-0 opacity-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-white rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full blur-lg animate-pulse delay-1000"></div>
      </motion.div>

      <div
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${pic})` }}
      >
        <div className="p-8 flex items-center justify-start space-x-4">
          <img src={logo} alt="Talent Sift Logo" className="h-10" />
          <div className="absolute top-0 right-0 p-4 flex items-center justify-end space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-blue font-bold">T</span>
            </div>
            <span className="text-2xl font-serif font-bold text-gray-100">Talent</span>
            <span className="text-2xl font-sans font-extrabold text-gray-100">Sift</span>
          </div>
        </div>

        <div className="flex-1 flex justify-start p-4">
          <JobFormStep1
            formData={formData}
            handleInputChange={handleInputChange}
            onNewSubmit={handleNewSubmit}
            jobDescription={jobDescription} // ✅ passed as prop
          />
        </div>

        <Toaster />
        <footer className="mt-auto">
          <Footer />
        </footer>
      </div>
    </div>
  );
}

export default App;
