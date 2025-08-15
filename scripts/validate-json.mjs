#!/usr/bin/env node
// Validates resume.json with basic structure and format checking

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RESUME_PATH = path.join(__dirname, "..", "resume.json");

// Basic validation rules
const requiredSections = ['basics', 'work', 'education', 'skills'];
const requiredBasics = ['name', 'email'];
const requiredWork = ['name', 'position', 'startDate'];
const requiredEducation = ['institution', 'area', 'studyType', 'startDate'];
const requiredSkills = ['name'];

function validateRequired(obj, requiredFields, context = '') {
  const missing = [];
  for (const field of requiredFields) {
    if (!obj.hasOwnProperty(field) || obj[field] === null || obj[field] === undefined) {
      missing.push(field);
    }
  }
  
  if (missing.length > 0) {
    const prefix = context ? `${context}.` : '';
    throw new Error(`Missing required fields: ${missing.map(f => prefix + f).join(', ')}`);
  }
}

function validateArray(arr, context = '') {
  if (!Array.isArray(arr)) {
    throw new Error(`${context} must be an array`);
  }
  return arr;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function validateDate(dateString) {
  if (typeof dateString !== 'string') return false;
  const dateRegex = /^\d{4}-\d{2}$/;
  return dateRegex.test(dateString);
}

function validateResume(data) {
  console.log('🔍 Validating resume.json...\n');
  
  try {
    // Validate required top-level sections
    validateRequired(data, requiredSections);
    
    // Validate basics section
    validateRequired(data.basics, requiredBasics, 'basics');
    
    // Validate email format
    if (data.basics.email && !validateEmail(data.basics.email)) {
      throw new Error('basics.email must be a valid email address');
    }
    
    // Validate work experience
    const work = validateArray(data.work, 'work');
    work.forEach((job, index) => {
      validateRequired(job, requiredWork, `work[${index}]`);
      if (job.startDate && !validateDate(job.startDate)) {
        throw new Error(`work[${index}].startDate must be a valid date (YYYY-MM format)`);
      }
      if (job.endDate && !validateDate(job.endDate)) {
        throw new Error(`work[${index}].endDate must be a valid date (YYYY-MM format)`);
      }
      if (job.url && !validateUrl(job.url)) {
        throw new Error(`work[${index}].url must be a valid URL`);
      }
    });
    
    // Validate education
    const education = validateArray(data.education, 'education');
    education.forEach((edu, index) => {
      validateRequired(edu, requiredEducation, `education[${index}]`);
      if (edu.startDate && !validateDate(edu.startDate)) {
        throw new Error(`education[${index}].startDate must be a valid date (YYYY-MM format)`);
      }
      if (edu.endDate && !validateDate(edu.endDate)) {
        throw new Error(`education[${index}].endDate must be a valid date (YYYY-MM format)`);
      }
      if (edu.url && !validateUrl(edu.url)) {
        throw new Error(`education[${index}].url must be a valid URL`);
      }
    });
    
    // Validate skills
    const skills = validateArray(data.skills, 'skills');
    skills.forEach((skill, index) => {
      validateRequired(skill, requiredSkills, `skills[${index}]`);
      if (skill.keywords && !Array.isArray(skill.keywords)) {
        throw new Error(`skills[${index}].keywords must be an array`);
      }
    });
    
    // Validate optional sections
    if (data.projects) {
      const projects = validateArray(data.projects, 'projects');
      projects.forEach((project, index) => {
        if (!project.name || !project.description) {
          throw new Error(`projects[${index}] must have name and description`);
        }
        if (project.url && !validateUrl(project.url)) {
          throw new Error(`projects[${index}].url must be a valid URL`);
        }
        if (project.keywords && !Array.isArray(project.keywords)) {
          throw new Error(`projects[${index}].keywords must be an array`);
        }
      });
    }
    
    if (data.certificates) {
      const certificates = validateArray(data.certificates, 'certificates');
      certificates.forEach((cert, index) => {
        if (!cert.name || !cert.issuer) {
          throw new Error(`certificates[${index}] must have name and issuer`);
        }
        if (cert.url && !validateUrl(cert.url)) {
          throw new Error(`certificates[${index}].url must be a valid URL`);
        }
      });
    }
    
    if (data.awards) {
      const awards = validateArray(data.awards, 'awards');
      awards.forEach((award, index) => {
        if (!award.title || !award.awarder) {
          throw new Error(`awards[${index}] must have title and awarder`);
        }
      });
    }
    
    // Success summary
    console.log('✅ Resume validation passed successfully!');
    console.log(`👤 Name: ${data.basics.name}`);
    console.log(`🧰 Work experiences: ${work.length}`);
    console.log(`🎓 Education entries: ${education.length}`);
    console.log(`🛠️  Skill categories: ${skills.length}`);
    console.log(`🚀 Projects: ${data.projects?.length || 0}`);
    console.log(`🏆 Awards: ${data.awards?.length || 0}`);
    console.log(`📜 Certificates: ${data.certificates?.length || 0}`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Resume validation failed:');
    console.error(`   ${error.message}`);
    return false;
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  if (!fs.existsSync(RESUME_PATH)) {
    console.error('❌ resume.json not found!');
    process.exit(1);
  }
  
  try {
    const resumeData = JSON.parse(fs.readFileSync(RESUME_PATH, 'utf8'));
    const isValid = validateResume(resumeData);
    process.exit(isValid ? 0 : 1);
  } catch (error) {
    console.error('❌ Failed to parse resume.json:');
    console.error(`   ${error.message}`);
    process.exit(1);
  }
}

export { validateResume };
