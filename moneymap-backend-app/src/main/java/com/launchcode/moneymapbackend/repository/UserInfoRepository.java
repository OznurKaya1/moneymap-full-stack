package com.launchcode.moneymapbackend.repository;

import com.launchcode.moneymapbackend.models.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
//I use JPA repository so my app talks to the database.
@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {
    Optional<UserInfo> findByEmail(String email);
    //This is a method that will find a user by their email address.
    // It returns an Optional<User> because the user may or may not exist in the database.
    //we use<Optional>
}
