import React, { useContext, useState } from 'react'
import './NewCourse.css'
import { CourseContext } from '../../Context/CourseContext';
import { getYouTubeId, getYouTubeEmbedUrl } from '../../utils/youtube';

const NewCourse = () => {
  const {
    course,
    courses,
    handleBasicsChange,
    handlePricingChange,
    handleModuleChange,
    handleLessonChange,
    handleQuizChange,
    handleAssignmentChange,
    addModule,
    addLesson,
    addQuiz,
    addAssignment,
    handleSave,
    handleImageChange,
  } = useContext(CourseContext);

  const { basics, pricing, module, modules } = course;
  const { lesson, quiz, lessons, quizes, assignments } = module;

  const [activeBar, setActiveBar] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDiv, setShowDiv] = useState("basics");

  // showInputs controls which small sub-form (lesson/quiz/assignment) is open
  const [showInputs, setShowInputs] = useState("");
  // moduleFormOpen controls whether the "new module" draft panel is open,
  // kept separate from showInputs so opening a lesson/quiz/assignment form
  // doesn't hide the module draft panel it lives inside
  const [moduleFormOpen, setModuleFormOpen] = useState(false);

  return (
    <div className='newCourse'>
      

      <div className="right">
        <h3>Create a new course</h3>
        <ul className='header'>
          <li className={activeIndex === 0 ? "active" : ""} onClick={() => { setActiveIndex(0); setShowDiv("basics"); }}>Basics</li>
          <li className={activeIndex === 1 ? "active" : ""} onClick={() => { setActiveIndex(1); setShowDiv("curriculum"); }}>Curriculum</li>
          <li className={activeIndex === 2 ? "active" : ""} onClick={() => { setActiveIndex(2); setShowDiv("pricing"); }}>Pricing</li>
          <li className={activeIndex === 3 ? "active" : ""} onClick={() => { setActiveIndex(3); setShowDiv("publish"); }}>Publish</li>
        </ul>

        {showDiv === "basics" ? (
          <div className="headerItem">
            <div className="item">
              <label>Course title *</label>
              <input type="text" placeholder='e.g. Complete Web Development Bootcamp' name='title' value={basics.title} onChange={handleBasicsChange} required />
            </div>
            <div className="item">
              <label>Category *</label>
              <select name='category' value={basics.category} onChange={handleBasicsChange} required>
                <option value="" disabled>Select a category</option>
                <option>Web Development</option>
                <option>App Development</option>
                <option>Graphic Designing</option>
                <option>Database</option>
                <option>Speaking Languages</option>
                <option>Digital Marketing</option>
              </select>
            </div>
            <div className="item">
              <label>Level *</label>
              <select name='level' value={basics.level} onChange={handleBasicsChange} required>
                <option value="" disabled>Select a level</option>
                <option>Beginner</option>
                <option>Advanced</option>
                <option>Intermediate</option>
              </select>
            </div>
            <div className="item">
              <label>Description *</label>
              <textarea placeholder='What will students learn.' name='overview' value={basics.overview} onChange={handleBasicsChange} required />
            </div>
            <div className="item">
              <label>Thumbnail *</label>
              <input type="file" accept="image/*" name='thumbnail' onChange={handleImageChange} required />
              {basics.thumbnail ? (
                <img
                  src={basics.thumbnail}
                  alt="Thumbnail preview"
                  style={{ width: "160px", height: "auto", borderRadius: "10px", marginTop: "8px" }}
                />
              ) : null}
            </div>
            <div className="item">
              <label>Starting date *</label>
              <input type="date" name='date' value={basics.date} onChange={handleBasicsChange} required />
            </div>
          </div>
        ) : null}

        {showDiv === "curriculum" ? (
          <div className="headerItem">
            <div className="row">
              <h4>Course Modules</h4>
              <span
                onClick={() => {
                  setModuleFormOpen((open) => !open);
                  setShowInputs("");
                }}
              >
                {moduleFormOpen ? "- Close" : "+ Add module"}
              </span>
            </div>

            {moduleFormOpen ? (
              <div className="addmodule">
                <div className="item">
                  <label>Module title *</label>
                  <input type="text" name='heading' value={module.heading} onChange={handleModuleChange} required />
                </div>
                <div className="item">
                  <label>Duration *</label>
                  <input type="text" name='duration' value={module.duration} onChange={handleModuleChange} required />
                </div>

                {lessons.length > 0 ? (
                  <div className="lessons">
                    {lessons.map((x, i) => (
                      <div className="item" key={i}>
                        <h4>{x.heading}</h4>
                        <p>{x.duration}{x.videoUrl ? " \u2022 \u25B6 Video" : ""}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                {quizes.length > 0 ? (
                  <div className="quizes">
                    {quizes.map((y, j) => (
                      <div className="item" key={j}>
                        <h4>{y.q}</h4>
                        <ul className='options'>
                          {y.options.split(',').filter((o) => o.trim() !== "").map((opt, k) => (
                            <li key={k}>{opt.trim()}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : null}

                {assignments.length > 0 ? (
                  <div className="assignments">
                    {assignments.map((z, k) => (
                      <div className="item" key={k}>
                        <p>{z}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                {showInputs === "less" ? (
                  <div className="addLesson">
                    <h4>New Lesson</h4>
                    <div className="item">
                      <label>Lesson title *</label>
                      <input type="text" name='heading' value={lesson.heading} onChange={handleLessonChange} required />
                    </div>
                    <div className="item">
                      <label>Lesson Duration *</label>
                      <input type="text" name='duration' value={lesson.duration} onChange={handleLessonChange} required />
                    </div>
                    <div className="item">
                      <label>Video link (YouTube) *</label>
                      <input
                        type="text"
                        inputMode="url"
                        name='videoUrl'
                        placeholder='https://www.youtube.com/watch?v=...'
                        value={lesson.videoUrl}
                        onChange={handleLessonChange}
                        required
                      />
                      {lesson.videoUrl.trim() === "" ? (
                        <p className="hint">Paste a YouTube link. The video is embedded from YouTube, not uploaded.</p>
                      ) : getYouTubeId(lesson.videoUrl) ? (
                        <div className="videoPreview">
                          <iframe
                            src={getYouTubeEmbedUrl(lesson.videoUrl)}
                            title="Lesson video preview"
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <p className="hint error">That doesn't look like a valid YouTube link.</p>
                      )}
                    </div>
                    <div className="item">
                      <label>Resource link (optional)</label>
                      <input
                        type="text"
                        inputMode="url"
                        name='resourceUrl'
                        placeholder='https://example.com/slides.pdf'
                        value={lesson.resourceUrl}
                        onChange={handleLessonChange}
                      />
                    </div>
                    <button onClick={() => { if (addLesson()) setShowInputs(""); }}>Save Lesson</button>
                  </div>
                ) : null}

                {showInputs === "qui" ? (
                  <div className="addQuiz">
                    <h4>New Quiz</h4>
                    <div className="item">
                      <label>Question *</label>
                      <input type="text" name='q' value={quiz.q} onChange={handleQuizChange} required />
                    </div>
                    <div className="item">
                      <label>Answer *</label>
                      <input type="text" name='a' value={quiz.a} onChange={handleQuizChange} required />
                    </div>
                    <div className="item">
                      <label>Options (separated by ,) *</label>
                      <input type="text" name='options' value={quiz.options} onChange={handleQuizChange} required />
                    </div>
                    <button onClick={() => { if (addQuiz()) setShowInputs(""); }}>Save Quiz</button>
                  </div>
                ) : null}

                {showInputs === "assi" ? (
                  <div className="addAssignment">
                    <h4>New Assignment</h4>
                    <div className="item">
                      <label>Assignment *</label>
                      <input type="text" name='assignment' value={module.assignment} onChange={handleAssignmentChange} required />
                    </div>
                    <button onClick={() => { if (addAssignment()) setShowInputs(""); }}>Save Assignment</button>
                  </div>
                ) : null}

                <div className="btns">
                  <span onClick={() => setShowInputs("less")}>+ Add lesson</span>
                  <span onClick={() => setShowInputs("qui")}>+ Add quiz</span>
                  <span onClick={() => setShowInputs("assi")}>+ Add assignment</span>
                </div>

                <button
                  onClick={() => {
                    if (addModule()) {
                      setModuleFormOpen(false);
                      setShowInputs("");
                    }
                  }}
                >
                  Save Module
                </button>
              </div>
            ) : null}

            <div className="modules">
              {modules.map((item, index) => (
                <div className="module_item" key={index}>
                  <div className="head">
                    <h4>{item.heading}</h4>
                    <p>{item.duration}</p>
                  </div>

                  <div className="list">
                    {item.lessons.length > 0 ? (
                      <div className="lessons">
                        {item.lessons.map((x, i) => (
                          <div className="item" key={i}>
                            <h4>{x.heading}</h4>
                            <p>{x.duration}{x.videoUrl ? " \u2022 \u25B6 Video" : ""}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {item.quizes.length > 0 ? (
                      <div className="quizes">
                        {item.quizes.map((y, j) => (
                          <div className="item" key={j}>
                            <h4>{y.q}</h4>
                            <ul className='options'>
                              {y.options.split(',').filter((o) => o.trim() !== "").map((opt, k) => (
                                <li key={k}>{opt.trim()}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {item.assignments.length > 0 ? (
                      <div className="assignments">
                        {item.assignments.map((z, k) => (
                          <div className="item" key={k}>
                            <p>{z}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {showDiv === "pricing" ? (
          <div className="headerItem">
            <div className="item">
              <label>Price (USD) {pricing.price === "paid" ? "*" : ""}</label>
              <input type="text" placeholder='e.g. 3.9' name='dollars' value={pricing.dollars} onChange={handlePricingChange} />
            </div>
            <div className="item">
              <label>Type *</label>
              <select name='price' value={pricing.price} onChange={handlePricingChange}>
                <option value='free'>Free</option>
                <option value='paid'>Paid</option>
              </select>
            </div>
          </div>
        ) : null}

        {showDiv === "publish" ? (
          <div className="publishItem">
            <h3>{basics.title}</h3>
            <p>{basics.category}</p>
            <p>{basics.overview}</p>
            <p>{modules.length} Modules</p>
            <h4>{pricing.dollars}</h4>
            <button onClick={handleSave}>Save</button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default NewCourse