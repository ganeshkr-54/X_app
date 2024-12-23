import React from "react";
import API_INSTANCE from "../services/api"
import { useState, useEffect } from "react";
import NotificationCard from "../components/NotificationCard";
import InfiniteScroll from "react-infinite-scroll-component"
import CommonLoading from "../components/CommonLoading";
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

function NotificationPage() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([])
  const [hasMore, sethasMore] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1); // For pagination



  async function fetchNotifications() {
    try {

      setLoading(true)
      const response = await API_INSTANCE.get(`/notification?page=${page}&limit=10`)
      console.log(response)
      const newNotifications = response.data.data.docs
      console.log(newNotifications)

      setNotifications((prevNotifications) => [...prevNotifications, ...newNotifications]);
      console.log(response.data.data.docs)
      setPage((prevPage) => prevPage + 1)
      sethasMore(response.data.data.hasNextPage)

    }
    catch (error) {
      console.log('error fetching notifications:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function refreshNotifications() {
    try {

      setLoading(true)
      const response = await API_INSTANCE.get(`/notification?page=1&limit=10`)
      // console.log(response)
      const newNotifications = response.data.data.docs
      // console.log(newNotifications)

      setNotifications(newNotifications);
      // console.log(response.data.data.docs)
      setPage(2)
      sethasMore(response.data.data.hasNextPage)

    }
    catch (error) {
      console.log('error fetching notifications:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    fetchNotifications()
  }, [])

  if (loading) {
    return <CommonLoading />
  }



  return (
    <>
      <div className="flex flex-col pl-8 ">
        <InfiniteScroll
          dataLength={notifications.length} //This is important field to render the next data
          next={fetchNotifications}
          hasMore={hasMore}
          loader={<CommonLoading />}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        // below props only if you need pull down functionality
        // refreshFunction={refreshNotifications}
        // pullDownToRefresh
        // pullDownToRefreshThreshold={50}
        // pullDownToRefreshContent={
        //   <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
        // }
        // releaseToRefreshContent={
        //   <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
        // }
        >
          <div className="notification page flex items-center  mt-2.5  mb-2">
            <button
              className="back-button flex items-center text-lg font-medium text-gray-600 mr-4  ml-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 w-6 h-6" style={{ color: '#1DA1F2' }} />
            </button>

            <h1 className="text-xl font-bold">Notifications</h1>

          </div>

          {notifications.map((ele) => <NotificationCard notification={ele} key={ele._id} />)}

        </InfiniteScroll>
      </div>
    </>
  )
}
export default NotificationPage