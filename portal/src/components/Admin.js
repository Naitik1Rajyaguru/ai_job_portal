// src/components/Admin.js
import React, { useState, useEffect, useCallback } from "react";
import useAuth from "../auth/useAuth";
import styled from "styled-components";
import { FaUserCircle, FaPlus, FaTimes, FaTrashAlt } from "react-icons/fa";
import config from "../config";

const breakpoints = {
  sm: "600px",
};

const device = {
  sm: `(max-width: ${breakpoints.sm})`,
};

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  margin-right: 30px;
`;

const ProfileIcon = styled(FaUserCircle)`
  font-size: 2.2em;
  color: #3498db;
  cursor: pointer;
  margin-right: 15px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.5em;
  color: #333;
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
  display: flex;
  align-items: center;
  font-size: 1em;
  width: fit-content;

  svg {
    margin-right: 8px;
  }

  &:hover {
    background-color: #2980b9;
  }

  @media ${device.sm} {
    width: fit-content;
    margin-bottom: 10px;
  }
`;

const Container = styled.div`
  text-align: center;
  padding: 30px;
  margin-top: 100px;
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 101;
`;

const PopupContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 60vh; // Set max height for popup
  overflow-y: auto; // Enable vertical scrolling
`;

const CloseButton = styled(FaTimes)`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 1.5em;
`;

const JobInput = styled.input`
  width: 84%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const JobTextArea = styled.textarea`
  width: 80%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
  resize: vertical; // Allow vertical resizing
`;

const JobItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
  overflow-wrap: break-word; // Allow long words to wrap
`;

const DeleteButton = styled(FaTrashAlt)`
  cursor: pointer;
  color: #e74c3c;
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: -5px;
  margin-bottom: 10px;
`;

const Notification = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${(props) => (props.success ? "#2ecc71" : "#e74c3c")};
  color: white;
  padding: 15px 20px;
  border-radius: 5px;
  z-index: 1001;
  display: ${(props) => (props.visible ? "block" : "none")};
`;

const JobCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px 50px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.2s;
  position: relative;

  &:hover {
    transform: translateY(-5px);
  }
`;

const JobActions = styled.div`
  position: absolute;
  top: -15px;
  right: -8px;
  display: flex;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 10px;
  color: #555;
`;

const JobDescription = styled.p`
  max-height: ${(props) => (props.expanded ? "none" : "60px")};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
`;

const Admin = () => {
  const [companyName, setCompanyName] = useState("");
  const { user, logout } = useAuth();
  const [showAddJobPopup, setShowAddJobPopup] = useState(false);
  const [popupJobList, setPopupJobList] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobList, setJobList] = useState([]);
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [notification, setNotification] = useState({
    message: "",
    success: false,
    visible: false,
  });
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [fetchJobsFlag, setFetchJobsFlag] = useState(false);

  const showNotification = useCallback((message, success) => {
    setNotification({
      message,
      success,
      visible: true,
    });

    setTimeout(() => {
      setNotification({
        message: "",
        success: false,
        visible: false,
      });
    }, 3000);
  }, []);

  const fetchJobs = useCallback(async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getjobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminEmail: user.email }),
      });

      if (response.ok) {
        const data = await response.json();
        setCompanyName(data.companyName); // Set company name
        setJobList(data.jobs);
      } else {
        const errorData = await response.json();
        showNotification(
          `Failed to fetch jobs: ${errorData.message || "Unknown error"}`,
          false
        );
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      showNotification("An unexpected error occurred.", false);
    }
  }, [user, showNotification]); // Add dependencies

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs, fetchJobsFlag]); // Add fetchJobs to dependency array

  const handleAddJobClick = () => {
    setShowAddJobPopup(true);
  };

  const closeAddJobPopup = () => {
    setShowAddJobPopup(false);
    setJobTitle("");
    setJobDescription("");
    setPopupJobList([]);
    setTitleError("");
    setDescriptionError("");
  };

  const handleCreateJobItem = () => {
    let isValid = true;
    if (!jobTitle) {
      setTitleError("Title is required.");
      isValid = false;
    } else {
      setTitleError("");
    }
    if (!jobDescription) {
      setDescriptionError("Description is required.");
      isValid = false;
    } else {
      setDescriptionError("");
    }
    if (isValid) {
      setJobList([
        ...jobList,
        { title: jobTitle, description: jobDescription },
      ]);
      setJobTitle("");
      setJobDescription("");
    }
    if (!titleError && !descriptionError) {
      setPopupJobList([
        ...popupJobList,
        { title: jobTitle, description: jobDescription },
      ]);
      setJobTitle("");
      setJobDescription("");
    }
  };

  const handleDeletePopupJobItem = (index) => {
    const updatedJobList = popupJobList.filter((_, i) => i !== index);
    setPopupJobList(updatedJobList);
  };

  const handlePublishJob = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/addjob`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobList: popupJobList, adminEmail: user.email }), // Send ONLY popupJobList
      });

      if (response.ok) {
        showNotification("Job published successfully!", true);
        setPopupJobList([]);
        setFetchJobsFlag(!fetchJobsFlag);
      } else {
        const errorData = await response.json();
        showNotification(
          `Failed to publish job: ${errorData.message || "Unknown error"}`,
          false
        );
      }
    } catch (error) {
      console.error("Error publishing job:", error);
      showNotification("An unexpected error occurred.", false);
    }
  };

  const toggleJobExpansion = (jobId) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        const response = await fetch(`${config.apiBaseUrl}/deletejob`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jobId }),
        });

        if (response.ok) {
          showNotification("Job deleted successfully!", true);
          await fetchJobs();
        } else {
          const errorData = await response.json();
          showNotification(
            `Failed to delete job: ${errorData.message || "Unknown error"}`,
            false
          );
        }
      } catch (error) {
        console.error("Error deleting job:", error);
        showNotification("An unexpected error occurred.", false);
      }
    }
  };

  return (
    <div>
      <Header>
        <HeaderLeft>
          <ProfileIcon />
          <Title>{companyName}</Title>
        </HeaderLeft>
        <HeaderRight>
          <Button onClick={handleAddJobClick}>
            <FaPlus /> Add Job
          </Button>
          <Button onClick={logout}>Logout</Button>
        </HeaderRight>
      </Header>

      <Container>
        {jobList.map((job) => {
          if (!job.job_details || job.job_details.length === 0) {
            return null;
          }

          return (
            <JobCard key={job._id} onClick={() => toggleJobExpansion(job._id)}>
              <JobActions>
                <ActionButton onClick={() => handleDeleteJob(job._id)}>
                  <FaTrashAlt />
                </ActionButton>
              </JobActions>
              <div>
                {job.job_details.map((detail, index) => (
                  <div key={`detail-${job._id}-${index}`}>
                    <strong>{detail.title}:</strong> {detail.description}
                  </div>
                ))}
              </div>
              <JobDescription
                $expanded={expandedJobId === job._id}
                key={`desc-${job._id}`}
              ></JobDescription>
            </JobCard>
          );
        })}
      </Container>

      {showAddJobPopup && (
        <PopupOverlay>
          <PopupContent>
            <CloseButton onClick={closeAddJobPopup} />
            <h3>Create Job Profile</h3>
            <JobInput
              placeholder="Job Title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
            {titleError && <ErrorMessage>{titleError}</ErrorMessage>}
            <JobTextArea
              placeholder="Job Description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            {descriptionError && (
              <ErrorMessage>{descriptionError}</ErrorMessage>
            )}
            <Button onClick={handleCreateJobItem}>Create Job</Button>
            {popupJobList.map((job, index) => (
              <JobItem key={index}>
                <div>
                  <strong>{job.title}</strong>
                  <p>{job.description}</p>
                </div>
                <DeleteButton onClick={() => handleDeletePopupJobItem(index)} />
              </JobItem>
            ))}
            <Button onClick={handlePublishJob}>Publish Job</Button>
          </PopupContent>
        </PopupOverlay>
      )}

      <Notification
        success={notification.success}
        visible={notification.visible}
      >
        {notification.message}
      </Notification>
    </div>
  );
};

export default Admin;
