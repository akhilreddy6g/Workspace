import featuresTabHook from "../../Noncomponents";
import { useContext, useEffect, useRef, useState} from "react";
import { apiUrl } from "../../Noncomponents";

export default function Activityframe(props) {
  const { state, takeAction } = useContext(featuresTabHook);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("Nothing to view. Upload files to view");
  const [notesFlag, changeFlag] = useState(false);
  const [notesContent, setNotesContent] = useState('');
  const [editStatus, changeEditStatus] = useState(false);
  const intervalRef = useRef(null);
  const skipRef = useRef(null);
  const completeRef = useRef(null);
  const previewRef = useRef(null);
  const fileRef = useRef(null);
  var minDiff = Infinity;
  var minIndex = null;

  function alertMessage(message){
    takeAction({type:"changeFailedAction", payload:message});
    setTimeout(() => {
        takeAction({type:"changeFailedAction"});
    }, 4500);
  }

  function changeIndex(e, count) {
    e.preventDefault();
    const newIndex = (props.flag? state.csActivityIndex : state.qsActivityIndex) + count;
    if (newIndex >= 0 && newIndex <= ((props.flag? state.combinedActivityData: state.qsCombinedSubActivityData).length) - 1) {
      takeAction({ type: props.flag? "changeCsActivityIndex" : "changeqsActivityIndex", payload: count});
    };
  };

  function closestTimeTab(tabs) {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); 
    var closestTab = null;
    var closestTimeDiff = Infinity;
    tabs.forEach((tab, index) => {
      const [startHours, startMinutes] = tab.activity_start_time?.split(":").map(Number) || [0, 0];
      const [endHours, endMinutes] = tab.activity_end_time?.split(":").map(Number) || [0, 0];
      const tabStartTime = startHours * 60 + startMinutes;
      const tabEndTime = endHours * 60 + endMinutes;
      const timeDiff = currentTime - tabStartTime;
      const absDiff = Math.abs(timeDiff);
      if(absDiff<minDiff && (props.flag? state.activeTab : state.qsActiveTab)===null && minIndex!=index){
        minIndex = index;
        var nextIndex = index+1
        minDiff = absDiff;
      };
      if (timeDiff >= 0 && timeDiff < closestTimeDiff && currentTime<tabEndTime) {
        closestTab = index;
        closestTimeDiff = timeDiff;
      };
    });
    if((props.flag? state.activeTab : state.qsActiveTab)!=closestTab){
      takeAction({type:props.flag? "changeActiveTab" : "changeqsActiveTab", payload:closestTab});
      if(closestTab!=null){
        takeAction({type:props.flag? "changeActTabButtRef" : "changeqsActTabButtRef", payload:closestTab});
      } else {
        takeAction({type:props.flag? "changeActTabButtRef" : "changeqsActTabButtRef", payload:(props.flag? state.csActivityIndex : state.qsActivityIndex)+1});
      }
    };
    return closestTab;
  }

  const highlightClosestTab = () => {
    const curclosestTab = closestTimeTab(props.flag? state.combinedActivityData: state.qsCombinedSubActivityData);
    return curclosestTab;
  };

  async function updateActivityStatus(event, id, type, status, newStatus, actionType) {
    event.preventDefault();
    takeAction({ type: "changeCurrentAction", payload: actionType + ` the activity`});
    if ((actionType === "skip" && (status === null)) || 
        (actionType === "complete" && status !== 1)) {
        try {
            const prevState = sessionStorage.getItem(id);
            if (prevState === null || prevState && JSON.parse(prevState).action !=="complete") {
                const userResponse = await new Promise((resolve) => {
                  takeAction({ type: "changeDisclaimerState", payload: true });
                  takeAction({ type: "changeDisclaimerButtons"});
                  takeAction({ type: "setResolve", payload: resolve });
                });
                if (userResponse){
                    const sessionMail = sessionStorage.getItem('email');
                    const mail = state.emailId? state.emailId : sessionMail
                    const url = type === "c" ? `/update-ca-status/${mail}?id=${id}&status=${newStatus}` : `/update-da-status/${mail}?id=${id}&status=${newStatus}`;
                    await apiUrl.post(url);
                    alertMessage(`Successfully ${actionType=="skip"? "skipped" : "completed"} the activity`);
                    sessionStorage.setItem(id, JSON.stringify({ action: actionType, value: true }));
                    if (completeRef.current && actionType === "complete") {
                        completeRef.current.disabled = true;
                    };
                    if (skipRef.current) {
                        skipRef.current.disabled = true;
                    };
                    if((props.flag? state.csActivityIndex : state.qsActivityIndex)+1<(props.flag? state.combinedActivityData: state.qsCombinedSubActivityData).length){
                      changeIndex(event, 1);
                    } else {
                      takeAction({type:props.flag? "changeActTabButtRef" : "changeqsActTabButtRef", payload:0});
                    };
                } 
            } else {
                const { action, value } = JSON.parse(prevState);
                if (action === actionType && value === true) {
                    alertMessage("Status updated already");
                };
            };
        } catch (error) {
            alertMessage("Error while updating the status")
        };
    } 
  }

  async function skipActivity(event, id, type, status) {
      await updateActivityStatus(event, id, type, status, 0, "skip");
  }

  async function completeActivity(event, id, type, status) {
      await updateActivityStatus(event, id, type, status, 1, "complete");
  }

  async function deleteActivity(event, id, type) {
    event.preventDefault();
    document.body.style.overflow = "hidden";
    takeAction({ type: "changeCurrentAction", payload: "delete the activity"});
    const userResponse = await new Promise((resolve) => {
      takeAction({ type: "changeDisclaimerState", payload: true });
      takeAction({ type: "changeDisclaimerButtons" });
      takeAction({ type: "setResolve", payload: resolve });
    });
    document.body.style.overflow = "auto";
    if (userResponse) {
      try {
        const sessionMail = sessionStorage.getItem('email');
        const mail = state.emailId? state.emailId : sessionMail
        const url = type === "c" ? `/delete-current-activity/${mail}?id=${id}` : `/delete-activity/${mail}?id=${id}`
        await apiUrl.delete(url);
        const request = indexedDB.open("WorkspaceFileDb", 1);
        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction("MediaFiles", "readwrite");
          const store = transaction.objectStore("MediaFiles");
          const delRequest = store.delete(id);
          delRequest.onsuccess = () => {
            setFile(null);
            setPreview(null);
            previewRef.current = null;
            fileRef.current = null;
            setError("Nothing to view. Upload files to view.");
          };
          delRequest.onerror = (e) => {
            setError("Error deleting the file.");
          };
        };
        request.onerror = (event) => {
          setError("Error accessing the database.");
        };
        alertMessage("Successfully deleted the activity");
        takeAction({ type: "changeActivityState", payload: false});
      } catch (error) {
        alertMessage("Error while deleting the activity");
      };
    }
  };

  const handleFileChange = (e) => {
    changeFlag(false);
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
        const fileType = uploadedFile.type;
        if (
            fileType.startsWith("image/") || 
            fileType.startsWith("video/") || 
            fileType.startsWith("audio/") || 
            fileType === "application/pdf"
        ) {
            saveFileToIndexedDB(uploadedFile, props.id);
            setFile(uploadedFile);
            fileRef.current = uploadedFile;
            setPreview(URL.createObjectURL(uploadedFile));
            previewRef.current = URL.createObjectURL(uploadedFile)
            alertMessage("Successfully uploaded the File");
            setError(null); 
        } else {
            setError("Please upload a valid media file (image, video, audio, or PDF).");
            alertMessage("File upload failed");
            setFile(null);
            fileRef.current = null;
            setPreview(null);
            previewRef.current = null;
        }
    }
  };

  const handleRemoveFile = async (e) => {
    e.preventDefault();
    document.body.style.overflow = "hidden";
    takeAction({ type: "changeCurrentAction", payload: "remove the uploaded file" });
    const userResponse = await new Promise((resolve) => {
      takeAction({ type: "changeDisclaimerState", payload: true });
      takeAction({ type: "changeDisclaimerButtons" });
      takeAction({ type: "setResolve", payload: resolve });
    });
    document.body.style.overflow = "auto";
    if (userResponse) {
      const request = indexedDB.open("WorkspaceFileDb", 1);
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("MediaFiles", "readwrite");
        const store = transaction.objectStore("MediaFiles");
        const delRequest = store.delete(props.id);
        delRequest.onsuccess = () => {
          setFile(null);
          setPreview(null);
          previewRef.current = null;
          fileRef.current = null;
          alertMessage("Successfully deleted the file");
          setError("Nothing to view. Upload files to view.");
        };
        delRequest.onerror = (e) => {
          setError("Error deleting the file.");
        };
      };
      request.onerror = (event) => {
        setError("Error accessing the database.");
      };
    }
  };

  function saveFileToIndexedDB(file, actId) {
    const request = indexedDB.open("WorkspaceFileDb", 1);
    request.onerror = (event) => {
      setError("Error accessing database.");
    };
    request.onupgradeneeded = (event) => {
        const db = request.result;
        const store = db.createObjectStore("MediaFiles", { keyPath: "id" });
    };
    request.onsuccess = (event) => {
        const db = request.result;
        const transaction = db.transaction("MediaFiles", "readwrite");
        const store = transaction.objectStore("MediaFiles");
        const fileEntry = {
          id: actId,
          file: file, 
        };
        store.put(fileEntry);
    };
  };

  function getFileFromIndexedDB(id, setPreview, setFile, setError) {
    const request = indexedDB.open("WorkspaceFileDb", 1); 
    request.onerror = (event) => {
        setError("Error accessing database.");
    };
    request.onupgradeneeded = (event) => {
        const db = request.result;
        const store = db.createObjectStore("MediaFiles", { keyPath: "id" });
    };
    request.onsuccess = (event) => {
        const db = request.result;
        const transaction = db.transaction("MediaFiles", "readonly");
        const store = transaction.objectStore("MediaFiles");
        const fileRequest = store.get(id);
        fileRequest.onsuccess = (e) => {
            const result = fileRequest.result;
            if (result) {
                const fileBlob = result.file;
                setFile(fileBlob);
                fileRef.current = fileBlob;
                setPreview(URL.createObjectURL(fileBlob));
                previewRef.current = URL.createObjectURL(fileBlob)
                setError(null);
            } else {
                setError("Nothing to view. Upload files to view.");
                setFile(null);
                setPreview(null);
                previewRef.current = null;
                fileRef.current = null;
            }
        };
        fileRequest.onerror = (e) => {
            setError("Error retrieving file.");
        };
    };
  }

  const reassignPreview = () => {
    setPreview(previewRef.current);
    setFile(fileRef.current);
    changeFlag(false);
  }

  function setNotesMode(){
    if(!notesFlag){
      changeFlag(true);
        if(error || preview){
        setError(null);
        setFile(null);
        setPreview(null);} 
    }
  }

  const handleNotesChange = (event) => {
    const updatedContent = event.target.innerText.trim()? event.target.innerText.trim() : null;
    setNotesContent(updatedContent);
  };

  const handleNotesEdit = async() => {
    if(editStatus){
      const data = {
        actId: props.id, 
        actNotes: notesContent && notesContent.trim()? notesContent.trim() : null
      }
      const sessionMail = sessionStorage.getItem('email');
      const mail = state.emailId? state.emailId : sessionMail
      await apiUrl.post(`/update-notes/${mail}`, {data})
    }
    changeEditStatus(!editStatus)
  };

  useEffect(() => {
    const closest = highlightClosestTab();
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(highlightClosestTab, 15000);
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [(props.flag? state.activeTab : state.qsActiveTab), (props.flag? state.combinedActivityData: state.qsCombinedSubActivityData)]);

  useEffect(() => {
    const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
    if (!indexedDB) {
      alertMessage("Uploaded files may not be accessible throughout the session");
    } else {
      getFileFromIndexedDB(props.id, setPreview, setFile, setError);
    };
  }, [props.id]);

  return (<> 
      <div className={`activityFrame ${state.darkMode? "scheduleDark" :"scheduleNormal"}`} style={{top: props.top!=null && props.top}} id={props.id}>
          <div className={`activityTitle  ${state.darkMode? "activityFrameDark" : "activityFrameNormal"}`} style={{borderTop:"0"}}>{(props.flag? state.csActivityIndex : state.qsActivityIndex)+1}. {props.activity}</div>
          <div className="csButtonsFrame">
            <div className="viewContent" style={{display:error && "flex", justifyContent:error && "center", alignItems:error && "center" || notesFlag && "center", border: notesFlag && editStatus ? "1px solid orange" : state.darkMode? "1px solid white" : "1px solid black", boxShadow: notesFlag && editStatus && "0 0 3px orange", borderRadius:"10px"}}>
              {notesFlag && <p contentEditable={editStatus? true : false} style={{width:"100%", height:"100%", overflow:"scroll", fontSize: "15px", fontFamily: "Cambria, Cochin, Georgia, 'Times New Roman', serif", color: state.darkMode? 'white' : "black", textAlign:"justify", padding:"10px", outline: "none"}} onInput={handleNotesChange}>{props.writtenNotes}</p>}
              {notesFlag && <button className={`csButtons ${state.darkMode? "soloActivityBarDark" : "soloActivityBarNormal"} noteseditButton`} style={{backgroundColor: editStatus? "green" :  "orange", width:"98%", marginBottom:"10px"}} onClick={handleNotesEdit}>{editStatus? "Save" : props.writtenNotes || notesContent ? "Edit" : "Write"}</button>}
            {error && <p style={{ color: "orangered", fontSize: "15px", fontFamily: "Cambria, Cochin, Georgia, 'Times New Roman', serif" }}>{error}</p>}
            {preview && file && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                    {file.type.startsWith("image/") && (
                        <img
                            src={preview}
                            alt="Preview"
                            style={{ maxWidth: "67vw", width:"fit-content", height:"fit-content",  maxHeight: "100vh", border: "1px solid black" }}
                        />
                    )}
                    {file.type.startsWith("video/") && (
                        <video
                            src={preview}
                            controls
                            style={{  maxWidth: "67vw", width:"fit-content", height:"fit-content",  maxHeight: "100vh", border: "1px solid black" }}
                        />
                    )}
                    {file.type.startsWith("audio/") && (
                        <audio src={preview} controls style={{  maxWidth: "67vw", width:"fit-content", height: "auto", border: "1px solid black" }} />
                    )}
                    {file.type === "application/pdf" && (
                        <embed
                            src={preview}
                            type="application/pdf"
                            style={{   width: "67vw", height: "100vh", border: "1px solid black" }}
                        />
                    )}
                    {file.type === "text/plain" && (
                        <div style={{ width: "67vw", height: "100vh", overflowY: "scroll", border: "1px solid black", padding: "10px" }}>
                            <p>Text File Content:</p>
                            <pre>{previewContent}</pre>
                        </div>
                    )}
                </div>
            )}
            </div>
            <div className="csButtonsContainer">
            <button className={`csButtons ${state.darkMode? "soloActivityBarDark" : "soloActivityBarNormal"}`} 
              onClick={(e)=>{skipActivity(e, props.id, props.type, props.status)}} 
              disabled={props.status==0 || props.status ==1 || sessionStorage.getItem(props.id)!==null && (JSON.parse(sessionStorage.getItem(props.id)).action=="skip" ||  JSON.parse(sessionStorage.getItem(props.id)).action=="complete")} 
              ref={skipRef} 
              style={{backgroundColor: props.status==0 || props.status ==1 || sessionStorage.getItem(props.id)!==null && (JSON.parse(sessionStorage.getItem(props.id)).action=="skip" ||  JSON.parse(sessionStorage.getItem(props.id)).action=="complete")? "orangered" : "red"}}>
                Skip
            </button>
            <button className={`csButtons ${state.darkMode? "soloActivityBarDark" : "soloActivityBarNormal"}`} 
              onClick={(e)=>{completeActivity(e, props.id, props.type, props.status)}} 
              disabled={props.status==1 || sessionStorage.getItem(props.id) && JSON.parse(sessionStorage.getItem(props.id)).action=="complete"} 
              ref={completeRef} 
              style={{backgroundColor: props.status==1 || sessionStorage.getItem(props.id) && JSON.parse(sessionStorage.getItem(props.id)).action=="complete" ? "darkgreen" : "green"}}>
              Complete
            </button>
            <button className={`csButtons ${state.darkMode? "soloActivityBarDark" : "soloActivityBarNormal"}`} style={{backgroundColor:"orange"}} onClick={(event)=>{deleteActivity(event, props.id, props.type)}}>Delete</button>
            <button className={`csButtons ${state.darkMode? "soloActivityBarDark" : "soloActivityBarNormal"}`} style={{backgroundColor:"orange"}} onClick={()=>{setNotesMode()}}>Notes</button>
            <div className={`csButtons ${state.darkMode? "soloActivityBarDark" : "soloActivityBarNormal"}`}>
              {(!notesFlag || preview || !previewRef.current) && <label htmlFor="file-upload" 
                className={`csButtons ${state.darkMode ? "soloActivityBarDark" : "soloActivityBarNormal"}`} 
                style={{backgroundColor: "teal", borderRadius: "10px", cursor: "pointer", textAlign: "center", padding: "4px 6px", fontWeight: "normal", marginBottom:"0"}}>
                Upload
              </label>}
             {(!notesFlag || preview || !previewRef.current) && <input id="file-upload" type="file"accept="application/pdf, image/*, text/plain, application/vnd.openxmlformats-officedocument.wordprocessingml.document, video/mp4" style={{ display: "none" }} onChange={handleFileChange} />}
             {notesFlag && previewRef.current && <button className={`csButtons ${state.darkMode? "soloActivityBarDark" : "soloActivityBarNormal"}`} style={{backgroundColor:"teal"}} onClick={reassignPreview}>{previewRef.current? "View File" : "Upload"}</button>}
            </div>
            <button className={`csButtons ${state.darkMode? "soloActivityBarDark" : "soloActivityBarNormal"}`} style={{backgroundColor: previewRef.current? "red" :  "teal"}} onClick={handleRemoveFile} disabled={preview==null}>Remove File</button>
            <div className={`activityDescription  ${state.darkMode? "soloActivityBarDark" : "soloActivityBarNormal"}`}>
              <div className={`activityDescrHeading`} style={{borderBottom: state.darkMode? "0.2px solid white": "0.2px solid black"}}>Description</div>
              <p className="notes">{props.notes}</p></div>
            </div>
          </div>
      </div> 
      <div className="buttonContainer">
      <div className="moveButtons">
        <button className="prevActivity" onClick={(e)=>{changeIndex(e, -1)}} disabled={(props.flag? state.csActivityIndex : state.qsActivityIndex)==0} >{"<"}</button>
        <button className="nextActivity" onClick={(e)=>{changeIndex(e, 1)}} disabled={(props.flag? state.csActivityIndex : state.qsActivityIndex)==(props.flag? state.combinedActivityData: state.qsCombinedSubActivityData).length-1}>{">"}</button>
      </div>
      </div>
      </>
  )
};